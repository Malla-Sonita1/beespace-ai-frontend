/**
 * Migré Ant Design 4.15.6 — BeeSpace UI
 * Métriques de performance pipeline (debug).
 */
import { Space, Typography } from 'antd'
import { ThunderboltOutlined } from '@ant-design/icons'
import { fmtDuration } from '../../utils/formatters'

const { Text } = Typography

export default function DebugInfo({ debug }) {
  if (!debug) return null

  return (
    <div className="debug-info">
      <Space size="middle" wrap>
        {debug.cached && (
          <Text type="success" strong className="debug-info__cached">
            <ThunderboltOutlined /> cached
          </Text>
        )}
        {debug.nlu_ms != null && <Text code>NLU {fmtDuration(debug.nlu_ms)}</Text>}
        {debug.api_ms != null && <Text code>API {fmtDuration(debug.api_ms)}</Text>}
        {debug.analyzer_ms != null && <Text code>ANA {fmtDuration(debug.analyzer_ms)}</Text>}
        {debug.gen_ms != null && <Text code>GEN {fmtDuration(debug.gen_ms)}</Text>}
        {debug.total_ms != null && (
          <Text strong className="debug-info__total">
            TOTAL {fmtDuration(debug.total_ms)}
          </Text>
        )}
      </Space>
    </div>
  )
}
