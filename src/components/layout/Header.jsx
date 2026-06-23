/**
 * Migré Ant Design 4.15.6 — BeeSpace UI
 * Barre supérieure — Layout.Header, Avatar, Tag, déconnexion.
 */
import { Layout, Space, Typography, Tag, Avatar, Button } from 'antd'
import { LogoutOutlined } from '@ant-design/icons'
import { useAuth } from '../../context/AuthContext'
import './Header.css'

const { Header: AntHeader } = Layout
const { Text } = Typography

export default function Header() {
  const { user, logout } = useAuth()

  const initials =
    user?.prenom && user?.nom
      ? `${user.prenom[0]}${user.nom[0]}`.toUpperCase()
      : (user?.username || 'U')[0].toUpperCase()

  const displayName = user?.prenom
    ? `${user.prenom} ${user.nom}`
    : user?.username || 'Utilisateur'

  const roleLabel = user?.roles?.[0] || user?.role || null

  return (
    <AntHeader className="app-header">
      <Space size={10} align="center" className="app-header__brand">
        <span className="app-header__logo" aria-hidden>🐝</span>
        <Text className="app-header__title">Beebot</Text>
        <Tag className="app-header__beta">beta</Tag>
        <span className="app-header__divider" aria-hidden>|</span>
        <span className="app-header__munisys">MUNISYS</span>
      </Space>

      <Space size={10} align="center" className="app-header__user">
        <Avatar size={32} className="app-header__avatar">
          {initials}
        </Avatar>
        <Text className="app-header__username">{displayName}</Text>
        {roleLabel && (
          <Tag className="app-header__role">{roleLabel}</Tag>
        )}
        <Button
          type="link"
          className="app-header__logout"
          icon={<LogoutOutlined />}
          onClick={logout}
        >
          Déconnexion
        </Button>
      </Space>
    </AntHeader>
  )
}
