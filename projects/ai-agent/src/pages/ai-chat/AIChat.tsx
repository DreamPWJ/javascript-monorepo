import { Bubble, BubbleProps, Sender } from '@ant-design/x'
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

const md = markdownit({ html: true, breaks: true });
md.renderer.rules.paragraph_open = () => '';
md.renderer.rules.paragraph_close = () => '';
const renderMarkdown: BubbleProps['messageRender'] = (content) => (

  <Typography>
    {/* biome-ignore lint/security/noDangerouslySetInnerHtml: used in demo */}
    <div dangerouslySetInnerHTML={{ __html: md.render(content) }} />
  </Typography>
);

/**
 * 对话列表
 * @returns 
 */
function AIChat () {
  const [value, setValue] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const scrollDiv = useRef<HTMLDivElement | null>(null)
  const senderRef = useRef<GetRef<typeof Sender>>(null)

  const array = Array.from({ length: 1 }, (_, index) => {

    return {
      id: `${index}`,
      role: 'user',
      content: 'sadfsadf设置子元素之间的间隔设置子元素之间的间隔设置子元素之间的间隔dsadfsadfsadf设置子元素之间的间隔设置子元素之间的间隔设置子元素之间的间隔dsadfsadfsadf设置子元素之间的间隔设置子元素之间的间隔设置子元素之间的间隔dsadfsadfsadf设置子元素之间的间隔设置子元素之间的间隔设置子元素之间的间隔dsadfsadfsadf设置子元素之间的间隔设置子元素之间的间隔设置子元素之间的间隔dsadfsadfsadf设置子元素之间的间隔设置子元素之间的间隔设置子元素之间的间隔dsadf'
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

    senderRef.current?.blur();
    setConversation([{
      id: `${conversations.length}`,
      role: 'user',
      content: input,
      loading: false,
    }, ...conversations,])
    setLoading(true)

    // 请求接口 数据

  }

  const MessageItem = (conversation: Conversation) => {
    let avatar: AvatarProps = {}
    if (conversation.role === 'user') {
      avatar = {
        icon: <UserOutlined />,
        style: userAvatar
      }
    } else {
      avatar = {
        icon: <OpenAIOutlined />,
        style: aiAvatar
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

  return (
    <div className={styles.container}>
      <div className={styles.chatContent} ref={scrollDiv}>
        {
          conversations.map(item => MessageItem(item))
        }
      </div>

      <div className={styles.comment}>
        <Sender
          loading={loading}
          value={value}
          ref={senderRef}
          onChange={setValue}
          onSubmit={() => {
            requestConversation(value)
          }}
          onCancel={() => {
            setLoading(false)
          }}
        />
      </div>
    </div>
  )
}


export default AIChat