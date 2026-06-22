import { ConfigProvider } from 'antd'
import frFR from 'antd/es/locale/fr_FR'
import './antd-overrides.css'

/**
 * Migré Ant Design 4.15.6 — BeeSpace UI
 * ConfigProvider global : locale FR, taille composants, popups.
 * Couleurs primaires → antd-overrides.css + variables .beespace-app-root.
 */
export default function AppThemeProvider({ children }) {
  return (
    <ConfigProvider
      locale={frFR}
      componentSize="middle"
      autoInsertSpaceInButton={false}
      getPopupContainer={(node) => node?.parentElement || document.body}
    >
      <div className="beespace-app-root">
        {children}
      </div>
    </ConfigProvider>
  )
}
