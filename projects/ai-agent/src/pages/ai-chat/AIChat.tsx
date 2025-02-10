import { Bubble, BubbleProps, Sender, Prompts, PromptProps } from '@ant-design/x'
import styles from './AIChat.module.css'
import React, { useEffect, useRef, useState } from 'react'
import { OpenAIOutlined, UserOutlined } from '@ant-design/icons'
import { AvatarProps, GetRef, Typography } from 'antd'
import markdownit from 'markdown-it'

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
  content: string
  loading?: boolean
}

const md = markdownit({ html: true, breaks: true })
md.renderer.rules.paragraph_open = () => ''
md.renderer.rules.paragraph_close = () => ''
const renderMarkdown: BubbleProps['messageRender'] = (content) => (
  <Typography>
    {/* biome-ignore lint/security/noDangerouslySetInnerHtml: used in demo */}
    <div dangerouslySetInnerHTML={{ __html: md.render(content) }} />
  </Typography>
)

/**
 * 对话列表
 * @returns
 */
function AIChat() {
  const scrollDiv = useRef<HTMLDivElement | null>(null)
  const senderRef = useRef<GetRef<typeof Sender>>(null)

  const [value, setValue] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const array = Array.from({ length: 0 }, (_, index) => {
    return {
      id: `${index}`,
      role: 'user',
      content: 'sadfsadf设置子元素之间的间隔x的间隔 a  间的间隔dsadf',
    } as Conversation
  })

  const [conversations, setConversation] = useState<Conversation[]>(array)

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
        content: input,
        loading: false,
      },
      {
        id: `system_${conversations.length}`,
        role: 'system',
        content: '',
        loading: true,
      },
    ])
    setLoading(true)

    setValue('')

    // TODO: 请求接口 数据
  }

  const cancelRequest = () => {
    setLoading(false)
    setConversation((prevConversations) => {
      if (prevConversations.length === 0) return prevConversations

      const lastMessage = prevConversations.at(-1)

      if (!lastMessage?.content || lastMessage?.content.length <= 0) {
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
        icon: <OpenAIOutlined />,
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
    const [prompts, setPrompt] = useState<PromptProps[]>([
      {
        key: '1',
        description: '今天的天气怎么样？',
      },
      {
        key: '2',
        description: '正月十五传统有哪些？',
      },
      {
        key: '3',
        description: '万达停车场剩余车位多少？',
      },
      {
        key: '4',
        description: '现在我的车在万平口停车费用是多少？',
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

  return (
    <div className={styles.container}>
      <div className={styles.chatContent} ref={scrollDiv}>
        {/* 对话列表 */}
        {conversations.map((item) => MessageItem(item))}

        <PromptsRender
        visible={conversations.length <= 0}
        onClick={(text) => {
          setValue(text)
          senderRef.current?.focus()
          // requestConversation(text)
        }}
      />
      </div>
      {/* 提示词语 */}
    
      {/* 输入框 */}
      <div className={styles.comment}>
        <div className={styles.commentContainer}>
          <Sender
            loading={loading}
            value={value}
            placeholder="给 deepseek 发消息"
            ref={senderRef}
            onChange={setValue}
            onSubmit={() => {
              requestConversation(value)
            }}
            onCancel={cancelRequest}
          />

          <div className={styles.commentTip}>内容由 AI 生成，请仔细甄别</div>
        </div>
      </div>
    </div>
  )
}

export default AIChat
