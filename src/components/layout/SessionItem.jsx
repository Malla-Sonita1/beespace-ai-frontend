/**
 * Migré Ant Design 4.15.6 — BeeSpace UI
 * Ligne de session — Dropdown, Modal.confirm, renommage inline.
 */
import { memo, useEffect, useRef, useState } from 'react'
import { Button, Dropdown, Input, Menu, Modal, Tooltip, Typography } from 'antd'
import { MoreOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { renameSession, deleteSession } from '../../services/api'
import {
  formatSessionDate,
  formatExchangeCount,
} from '../../utils/sessionFormatters'

const { Text } = Typography

const SessionItem = memo(function SessionItem({
  session,
  isActive,
  onSelect,
  onRenamed,
  onDeleted,
}) {
  const [hovered, setHovered] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editValue, setEditValue] = useState(session.title)
  const inputRef = useRef(null)

  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  useEffect(() => {
    if (!editing) setEditValue(session.title)
  }, [session.title, editing])

  const handleRenameOk = async () => {
    const val = editValue.trim()
    if (val && val !== session.title) {
      try {
        await renameSession(session.session_id, val)
        onRenamed(session.session_id, val)
      } catch {
        /* silencieux */
      }
    }
    setEditing(false)
  }

  const handleRenameCancel = () => {
    setEditing(false)
    setEditValue(session.title)
  }

  const startRename = () => {
    setMenuOpen(false)
    setEditValue(session.title)
    setEditing(true)
  }

  const confirmDelete = () => {
    setMenuOpen(false)
    Modal.confirm({
      title: 'Supprimer cette conversation ?',
      content: 'Cette action est irréversible.',
      okText: 'Supprimer',
      okType: 'danger',
      cancelText: 'Annuler',
      centered: true,
      onOk: async () => {
        try {
          await deleteSession(session.session_id)
          onDeleted(session.session_id)
        } catch {
          /* silencieux */
        }
      },
    })
  }

  const handleMenuClick = ({ key, domEvent }) => {
    domEvent.stopPropagation()
    if (key === 'rename') startRename()
    if (key === 'delete') confirmDelete()
  }

  const menu = (
    <Menu onClick={handleMenuClick} className="session-item__menu">
      <Menu.Item key="rename" icon={<EditOutlined />}>
        Renommer
      </Menu.Item>
      <Menu.Item key="delete" icon={<DeleteOutlined />} danger>
        Supprimer
      </Menu.Item>
    </Menu>
  )

  const meta = `${formatSessionDate(session.updated_at)}${formatExchangeCount(session.msg_count)}`

  if (editing) {
    return (
      <div className="session-item session-item--editing" role="listitem">
        <div className="session-item__edit" onClick={(e) => e.stopPropagation()}>
          <Input
            ref={inputRef}
            className="session-item__edit-input"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleRenameOk()
              if (e.key === 'Escape') handleRenameCancel()
            }}
            aria-label="Nouveau titre de la conversation"
          />
          <div className="session-item__edit-actions">
            <Button type="primary" size="small" onClick={handleRenameOk}>
              OK
            </Button>
            <Button size="small" onClick={handleRenameCancel}>
              Annuler
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`session-item${isActive ? ' session-item--active' : ''}${hovered ? ' session-item--hovered' : ''}${menuOpen ? ' session-item--menu-open' : ''}`}
      role="listitem"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="session-item__row">
        <button
          type="button"
          className="session-item__main"
          onClick={() => onSelect(session.session_id)}
          aria-current={isActive ? 'true' : undefined}
          aria-label={`Conversation : ${session.title}`}
        >
          <Tooltip title={session.title} placement="topLeft" mouseEnterDelay={0.35}>
            <span className="session-item__title-wrap">
              <Text className="session-item__title" ellipsis>
                {session.title}
              </Text>
            </span>
          </Tooltip>
          <Text className="session-item__meta">{meta}</Text>
        </button>

        <Dropdown
          overlay={menu}
          trigger={['click']}
          visible={menuOpen}
          onVisibleChange={setMenuOpen}
          placement="bottomRight"
          getPopupContainer={(node) => node.parentElement || document.body}
        >
          <Button
            type="text"
            size="small"
            className="session-item__more"
            icon={<MoreOutlined />}
            onClick={(e) => e.stopPropagation()}
            aria-label={`Actions pour ${session.title}`}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
          />
        </Dropdown>
      </div>
    </div>
  )
})

export default SessionItem
