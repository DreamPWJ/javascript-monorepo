import { Bubble, Sender, Prompts, PromptProps } from '@ant-design/x'
import styles from './AIChat.module.css'
import React, { useEffect, useRef, useState } from 'react'
import { SmileOutlined, UserOutlined } from '@ant-design/icons'
import { AvatarProps, GetRef, message, Typography } from 'antd'
import markdownit from 'markdown-it'
import request, { getAxios } from '@/request'
import { CancelTokenSource } from 'axios'

const aiAvatar: React.CSSProperties = {
  color: '#f56a00',
  backgroundColor: '#fde3cf',
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
  console.log('AIChat')

  const scrollDiv = useRef<HTMLDivElement | null>(null)
  const senderRef = useRef<GetRef<typeof Sender>>(null)

  const [cancelTokenSource, setCancelTokenSource] = useState<CancelTokenSource | null>(null)

  const [conversations, setConversation] = useState<Conversation[]>([])

  const [messageApi, contextHolder] = message.useMessage()

  const [leaguerId, setLeaguerId] = useState<string | null>(null)

  useEffect(() => {
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
    } else {
      setLeaguerId(id)
    }

 
    setTimeout(() => {
      document.title = '蓝能AI'
    }, 350);
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
        icon: <SmileOutlined />,
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

  const PromptsRender = (params: { visible: boolean; onClick: (text: string) => void }) => {
    const [prompts] = useState<PromptProps[]>([
      {
        key: '1',
        description: '请告诉我已绑定的车牌？',
      },
      {
        key: '3',
        description: '万达停车场收费标准?',
      },
      {
        key: '4',
        description: '日照好停车客服电话号码？',
      },
    ])

    if (!params.visible) {
      return <></>
    }
    return (
      <div>
        <Prompts
          onItemClick={(info) => {
            params.onClick?.(info.data?.description?.toString() || '')
          }}
          title="✨ 鼓舞人心的火花和奇妙的提示"
          items={prompts}
          wrap
        />
      </div>
    )
  }

  const CommentInput = () => {
    const [value, setValue] = useState<string>('')

    return <>
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

          <div className={styles.commentTip}>内容由 AI 生成</div>
        </div>
      </div>
    </>
  }

  return (
    <div className={styles.container}>
      {contextHolder}
      {leaguerId && leaguerId.length > 0 && (
        <>
          <div className={styles.chatContent} ref={scrollDiv}>
            {/* 对话列表 */}
            {conversations.map((item) => MessageItem(item))}

            <PromptsRender
              visible={conversations.length <= 0}
              onClick={(text) => {
                // setValue(text)
                // senderRef.current?.focus()
                requestConversation(text)
              }}
            />
          </div>
          <CommentInput />
        </>
      )}
      {
        (!leaguerId || leaguerId.length <=0) && <>
          <div className={styles.commentTip}>登陆失败，请在好停车公众号内打开</div>
        </>
      }
    </div>
  )
}

export default AIChat
