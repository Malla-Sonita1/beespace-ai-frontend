/**
 * Migré Ant Design 4.15.6 — BeeSpace UI
 * Barre latérale des conversations — Layout.Sider, List, nouveau chat.
 */
import { useCallback } from 'react'
import { Layout, Button, List, Typography, Tooltip } from 'antd'
import {
  LeftOutlined,
  RightOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import SessionItem from './SessionItem'
import './SessionSidebar.css'

const { Sider } = Layout
const { Text } = Typography

const SIDEBAR_WIDTH = 228
const SIDEBAR_COLLAPSED_WIDTH = 44

export default function SessionSidebar({
  sessions,
  currentSessionId,
  onNewChat,
  onSelectSession,
  onSessionsChange,
  isOpen,
  onToggle,
}) {
  const handleRenamed = useCallback((sid, newTitle) => {
    onSessionsChange(
      sessions.map((s) =>
        s.session_id === sid ? { ...s, title: newTitle } : s
      )
    )
  }, [sessions, onSessionsChange])

  const handleDeleted = useCallback((sid) => {
    onSessionsChange(sessions.filter((s) => s.session_id !== sid))
    if (sid === currentSessionId) onNewChat()
  }, [sessions, currentSessionId, onNewChat, onSessionsChange])

  return (
    <Sider
      className={`session-sidebar${isOpen ? '' : ' session-sidebar--collapsed'}`}
      width={SIDEBAR_WIDTH}
      collapsedWidth={SIDEBAR_COLLAPSED_WIDTH}
      collapsed={!isOpen}
      theme="light"
      trigger={null}
      collapsible
      role="navigation"
      aria-label="Historique des conversations"
    >
      <div className="session-sidebar__toolbar">
        <Tooltip title={isOpen ? 'Réduire' : 'Ouvrir'} placement="right">
          <Button
            className="session-sidebar__toggle"
            icon={isOpen ? <LeftOutlined /> : <RightOutlined />}
            onClick={onToggle}
            aria-label={isOpen ? 'Réduire la barre latérale' : 'Ouvrir la barre latérale'}
            aria-expanded={isOpen}
          />
        </Tooltip>

        {isOpen && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            className="session-sidebar__new-btn"
            onClick={onNewChat}
          >
            Nouveau chat
          </Button>
        )}
      </div>

      {isOpen && (
        <>
          {sessions.length > 0 && (
            <Text className="session-sidebar__heading">Historique</Text>
          )}

          <List
            className="session-sidebar__list"
            dataSource={sessions}
            locale={{ emptyText: 'Aucune conversation' }}
            renderItem={(session) => (
              <List.Item>
                <SessionItem
                  session={session}
                  isActive={session.session_id === currentSessionId}
                  onSelect={onSelectSession}
                  onRenamed={handleRenamed}
                  onDeleted={handleDeleted}
                />
              </List.Item>
            )}
          />
        </>
      )}
    </Sider>
  )
}
