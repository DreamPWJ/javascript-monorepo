import { Bubble, Sender, Prompts, PromptProps } from '@ant-design/x'
import styles from './AIChat.module.css'
import React, { memo, use, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { BulbOutlined, FireOutlined, UserOutlined } from '@ant-design/icons'
import { AvatarProps, GetRef, message, Typography } from 'antd'
import markdownit from 'markdown-it'
import request, { getAxios } from '@/request'
import { CancelTokenSource } from 'axios'
import AIAvatar from '@/assets/ai-avatar.png'

const aiAvatar: React.CSSProperties = {
  color: '#4e6afb',
  backgroundColor: '#dceafe',
}

const userAvatar: React.CSSProperties = {
  color: '#fff',
  backgroundColor: '#87d068',
}

type Conversation = {
  id: string
  role: 'user' | 'system'
  content: Message
  loading?: boolean
}

type Message = {
  type: 'text' | 'file'
  content: string
}

const md = markdownit({ html: true, breaks: true })
md.renderer.rules.paragraph_open = () => ''
md.renderer.rules.paragraph_close = () => ''
const renderMarkdown = (message: Message) => (
  <Typography>
    {/* biome-ignore lint/security/noDangerouslySetInnerHtml: used in demo */}
    <div dangerouslySetInnerHTML={{ __html: md.render(message.content) }} />
  </Typography>
)

const getUrlParameter = (param: string) => {
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get(param) // 获取指定参数的值
}

const removeMultipleUrlParams = (params: string[] = []) => {
  const url = new URL(window.location.href)
  params.forEach((param) => url.searchParams.delete(param)) // 删除多个参数
  window.history.replaceState({}, '', url.toString())
}

/**
 * 对话列表
 * @returns
 */
function AIChat () {

  const scrollDiv = useRef<HTMLDivElement | null>(null)
  const senderRef = useRef<GetRef<typeof Sender>>(null)

  const [cancelTokenSource, setCancelTokenSource] = useState<CancelTokenSource | null>(null)

  const [conversations, setConversation] = useState<Conversation[]>([])

  const [messageApi, contextHolder] = message.useMessage()

  const [leaguerId, setLeaguerId] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {

    console.log('AIChat')
    const id = getUrlParameter('leaguerId')?.trim() || import.meta.env.VITE_BASE_LEAGUERID

    if (!id || id.length <= 0) {
      // 跳转到公众号内登录
      window.location.href = `http://jtss.rzbus.cn:18805/?redirect=${window.location.href}#/thirdAuth`
      return
    }
    localStorage.setItem('leaguerId', id?.toString() || '')

    removeMultipleUrlParams(['leaguerId'])

    if (id === 'null') {
      setLeaguerId(null)
      setErrorMessage('登陆失败，请在好停车公众号内打开')
    } else {
      setLeaguerId(id)
      setErrorMessage(null)
    }

    setTimeout(() => {
      document.title = '蓝能AI'
    }, 350)
  }, [])

  useEffect(() => {
    if (scrollDiv.current) {
      scrollDiv.current.scrollTo({
        top: scrollDiv.current.scrollHeight,
        behavior: 'smooth',
      })
    }
  }, [conversations])

  // 请求对话
  const requestConversation = async (input: string) => {
    senderRef.current?.blur()
    setConversation([
      ...conversations,
      {
        id: `user_${conversations.length}`,
        role: 'user',
        content: { type: 'text', content: input },
        loading: false,
      },
      {
        id: `system_${conversations.length}`,
        role: 'system',
        content: { type: 'text', content: '' },
        loading: true,
      },
    ])


    // 请求接口 数据
    const cancelToken = getAxios().CancelToken.source()
    setCancelTokenSource(cancelToken)
    request
      .post(
        '/api/chat',
        {
          leaguer_id: leaguerId,
          chat_content: input,
        },
        {
          cancelToken: cancelToken.token,
        },
      )
      .then((res) => {
        // console.log(res.data)

        if (res.data.code === 200) {
          setConversation((prevItems) => {
            // 获取最后一项并更新
            const updatedItems = [...prevItems]
            const lastItemIndex = updatedItems.length - 1
            updatedItems[lastItemIndex] = {
              ...updatedItems[lastItemIndex],
              content: res.data.data,
              loading: false,
            }

            return updatedItems
          })
        } else {
          messageApi.open({
            type: 'error',
            content: res.data.msg || '出错了',
          })
          clearLastMessage()
        }
      })
      .catch((error) => {
        if (!getAxios().isCancel(error)) {
          // 不是主动取消的 说明请求失败了
          clearLastMessage()
          messageApi.open({
            type: 'error',
            content: '服务器繁忙，请稍后尝试',
          })
        }
      })
      .finally(() => {
        setCancelTokenSource(null)
      })
  }

  const clearLastMessage = () => {
    setConversation((prevConversations) => {
      if (prevConversations.length === 0) return prevConversations

      const lastMessage = prevConversations.at(-1)

      if (!lastMessage?.content || lastMessage?.content?.content.length <= 0) {
        return prevConversations.slice(0, -1)
      } else {
        return prevConversations.map((conversation, index) =>
          index === 0 ? { ...conversation, loading: false } : conversation,
        )
      }
    })
  }

  const MessageItem = (conversation: Conversation) => {
    let avatar: AvatarProps = {}
    if (conversation.role === 'user') {
      avatar = {
        icon: <UserOutlined />,
        style: userAvatar,
      }
    } else {
      avatar = {
        icon: <img src={AIAvatar} />,
        style: aiAvatar,
      }
    }

    return (
      <Bubble
        key={conversation.id}
        avatar={avatar}
        content={conversation.content}
        loading={conversation.loading}
        placement={conversation.role === 'user' ? 'end' : 'start'}
        messageRender={renderMarkdown}
        style={{ padding: 0 }}
      />
    )
  }

  const PromptsRender = useCallback(
    ({ visible, onClick }: { visible: boolean; onClick?: (text: string) => void }) => {
      const [prompts, setPrompts] = useState<PromptProps[]>([])

      useEffect(() => {
        request.get('/api/prompt').then(res => {
          if (res.data.code === 200) {
            const data = res.data.data.map((item: any) => {
              return {
                key: item,
                description: item,
              }
            })
            setPrompts(data)
          }
        })
      }, [])

      if (!visible) {
        return <></>
      }
      return (
        <div>
          <Prompts
            styles={{
              item: {
                flex: 'none',
                width: '100%',
                backgroundImage: `linear-gradient(137deg, #e5f4ff 0%, #efe7ff 100%)`,
                border: 0,
              },
              subItem: {
                background: 'rgba(255,255,255,0.45)',
                border: '1px solid #FFF',
              },
            }}
            onItemClick={(info) => {
              onClick?.(info.data?.description?.toString() || '')
            }}
            title="🤔 你可能也想问:"
            items={prompts}
            vertical
          />
        </div>
      )
    },
    [],
  )

  const visiblePromptsRender = useMemo(() => {
    return (leaguerId && leaguerId.length > 0 && conversations.length <= 0) as boolean
  }, [leaguerId, conversations])



  const CommentInput = () => {
    const [value, setValue] = useState<string>('')

    return (
      <>
        <div className={styles.comment}>
          <div className={styles.commentContainer}>
            <Sender
              loading={cancelTokenSource != null}
              value={value}
              placeholder="给 蓝能AI 发消息"
              ref={senderRef}
              onChange={setValue}
              onSubmit={() => {
                setValue('')
                requestConversation(value)
              }}
              onCancel={() => {
                cancelTokenSource?.cancel()
                clearLastMessage()
              }}
            />

            <div className={styles.commentTip}>本功能由AI技术生成，更多服务请联系人工客服。</div>
          </div>
        </div>
      </>
    )
  }

  return (
    <div className={styles.container}>
      {contextHolder}

      {leaguerId && leaguerId.length > 0 && (
        <>
          <div className={styles.chatContent} ref={scrollDiv}>
            {/* 对话列表 */}
            {conversations.map((item) => MessageItem(item))}
            <PromptsRender visible={visiblePromptsRender} onClick={requestConversation} />
          </div>
          <CommentInput />
        </>
      )}

      {errorMessage && errorMessage.length > 0 && (
        <>
          <div className={styles.commentTip}>{errorMessage}</div>
        </>
      )}
    </div>
  )
}

export default AIChat
