import { Card, CardHeader, CardTitle, CardContent } from "./Card";

export const PoolMetrics = ({ metrics, isInRange }) => (
    <Card className="bg-gray-800">
      <CardHeader>
        <CardTitle className="text-lg">Pool Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        {metrics && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-400">Estimated Fees Last 24h</span>
                <div className="text-2xl font-bold text-green-500">
                  {metrics.feeLast24.toFixed(2)}%
                </div>
              </div>
              <div>
                <span className="text-sm text-gray-400">Monthly</span>
                <div className="text-2xl font-bold text-green-500">
                  {(metrics.feeLast24 * 30).toFixed(2)}%
                </div>
              </div>
              <div>
                <span className="text-sm text-gray-400">Yearly</span>
                <div className="text-2xl font-bold text-green-500">
                  {(metrics.feeLast24 * 365).toFixed(2)}%
                </div>
              </div>
              <div>
                <span className="text-sm text-gray-400">Impermanent Loss</span>
                <div className="text-2xl font-bold text-red-500">
                  {metrics.impermanentLoss.toFixed(2)}%
                </div>
              </div>
            </div>
            
            <div>
              <span className="text-sm text-gray-400">Projected Return</span>
              <div className={`text-2xl font-bold ${
                metrics.projectedReturn >= 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {metrics.projectedReturn.toFixed(2)}%
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
  