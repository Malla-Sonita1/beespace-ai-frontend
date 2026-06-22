/**
 * Migré Ant Design 4.15.6 — BeeSpace UI
 * Page de connexion BeeSpace — Form, Card, Tabs, Alert.
 */
import { useState } from 'react'
import {
  Alert,
  Button,
  Card,
  Form,
  Input,
  Tabs,
  Typography,
} from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useAuth } from '../context/AuthContext'
import './LoginPage.css'

const { Title, Text, Paragraph } = Typography
const { TabPane } = Tabs

export default function LoginPage() {
  const { login, loginWithToken } = useAuth()
  const [credentialsForm] = Form.useForm()
  const [tokenForm] = Form.useForm()
  const [activeTab, setActiveTab] = useState('credentials')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCredentialsLogin = async ({ username, password }) => {
    setLoading(true)
    setError('')
    try {
      await login(username, password)
    } catch {
      setError('Identifiants incorrects ou serveur BeeSpace inaccessible.')
    } finally {
      setLoading(false)
    }
  }

  const handleTokenLogin = ({ token }) => {
    setError('')
    const trimmed = token?.trim()
    if (!trimmed) {
      setError('Token requis.')
      return
    }
    loginWithToken(trimmed, { username: 'Utilisateur dev', role: 'DEV' })
  }

  const handleTabChange = (key) => {
    setActiveTab(key)
    setError('')
  }

  return (
    <main className="login-page">
      <div className="login-page__bg" aria-hidden />

      <Card className="login-page__card" bordered>
        <header className="login-page__brand">
          <div className="login-page__logo" aria-hidden>
            🐝
          </div>
          <Title level={3} className="login-page__title">
            Beebot
          </Title>
          <Paragraph className="login-page__subtitle">
            Assistant conversationnel ERP
          </Paragraph>
          <Text className="login-page__munisys">MUNISYS</Text>
        </header>

        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          className="login-page__tabs"
          centered
        >
          <TabPane tab="Connexion BeeSpace" key="credentials">
            <Form
              form={credentialsForm}
              layout="vertical"
              className="login-page__form"
              onFinish={handleCredentialsLogin}
              requiredMark={false}
            >
              {error && (
                <Alert
                  className="login-page__alert"
                  type="error"
                  message={error}
                  showIcon
                  role="alert"
                />
              )}

              <Form.Item
                name="username"
                label="Identifiant BeeSpace"
                rules={[
                  { required: true, message: 'Veuillez saisir votre identifiant.' },
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="nom.prenom"
                  autoComplete="username"
                  autoFocus
                  aria-label="Identifiant BeeSpace"
                />
              </Form.Item>

              <Form.Item
                name="password"
                label="Mot de passe"
                rules={[
                  { required: true, message: 'Veuillez saisir votre mot de passe.' },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  aria-label="Mot de passe"
                />
              </Form.Item>

              <div className="login-page__forgot-wrap">
                <Button
                  type="link"
                  className="login-page__forgot"
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  aria-disabled="true"
                  tabIndex={0}
                >
                  Mot de passe oublié ?
                </Button>
              </div>

              <Form.Item className="login-page__form-submit">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  className="login-page__submit"
                >
                  Se connecter
                </Button>
              </Form.Item>
            </Form>
          </TabPane>

          <TabPane tab="Token direct (dev)" key="token">
            <Form
              form={tokenForm}
              layout="vertical"
              className="login-page__form"
              onFinish={handleTokenLogin}
              requiredMark={false}
            >
              {error && (
                <Alert
                  className="login-page__alert"
                  type="error"
                  message={error}
                  showIcon
                  role="alert"
                />
              )}

              <Form.Item
                name="token"
                label="JWT Bearer Token"
                rules={[{ required: true, message: 'Token requis.' }]}
              >
                <Input.TextArea
                  className="login-page__token-input"
                  placeholder="eyJhbGciOiJIUzI1NiJ9..."
                  rows={3}
                  aria-label="JWT Bearer Token"
                />
              </Form.Item>

              <Text type="secondary" className="login-page__hint">
                Récupère le token depuis Postman après authentification BeeSpace.
              </Text>

              <Form.Item className="login-page__form-submit login-page__form-submit--token">
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  className="login-page__submit"
                >
                  Utiliser ce token
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>
      </Card>
    </main>
  )
}
