import { Card, CardHeader, CardTitle, CardContent } from "./Card";
import { Alert, AlertCircle, AlertDescription } from "./Alert";

export const PositionMetrics = ({ metrics, positionConfig, isInRange }) => (
    <Card className="bg-gray-800">
      <CardHeader>
        <CardTitle className="text-lg">Position Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        {metrics && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h1 className="text-sm text-gray-600">APR</h1>
                <span className="text-sm text-gray-400">Estimated Fees Last 24h</span>
                <div className="text-2xl font-bold text-green-500">
                  {(positionConfig.depositAmount * metrics.feeLast24 / 100).toFixed(2)} $
                </div>
              </div>
              <div>
                <h1 className="text-sm text-gray-600">APY</h1>
                <span className="text-sm text-gray-400">Estimated Fees Last 24h</span>
                <div className="text-2xl font-bold text-green-500">
                  {(positionConfig.depositAmount * metrics.feeLast24 / 100).toFixed(2)} $
                </div>
              </div>
              <div>
                <span className="text-sm text-gray-400">Monthly</span>
                <div className="text-2xl font-bold text-green-500">
                  {(positionConfig.depositAmount * metrics.feeLast24 * 0.30).toFixed(2)} $
                </div>
              </div>
              <div>
                <span className="text-sm text-gray-400">Monthly</span>
                <div className="text-2xl font-bold text-green-500">
                  {(positionConfig.depositAmount * (1 + metrics.feeLast24 / 100) ** 30 - positionConfig.depositAmount).toFixed(2)} $
                </div>
              </div>
              <div>
                <span className="text-sm text-gray-400">Yearly</span>
                <div className="text-2xl font-bold text-green-500">
                  {(positionConfig.depositAmount * metrics.feeLast24 * 3.65).toFixed(2)} $
                </div>
              </div>
              <div>
                <span className="text-sm text-gray-400">Yearly</span>
                <div className="text-2xl font-bold text-green-500">
                {(positionConfig.depositAmount * (1 + metrics.feeLast24 / 100) ** 365 - positionConfig.depositAmount).toFixed(2)} $
                </div>
              </div>
              
            </div>

            {/*<div>
                <span className="text-sm text-gray-400">Impermanent Loss</span>
                <div className="text-2xl font-bold text-red-500">
                  {positionConfig.depositAmount * metrics.impermanentLoss.toFixed(2)} $
                </div>
            </div>
            
            <div>
              <span className="text-sm text-gray-400">Projected Return</span>
              <div className={`text-2xl font-bold ${
                metrics.projectedReturn >= 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {(positionConfig.depositAmount / 100 * metrics.projectedReturn).toFixed(2)} $
              </div>
            </div>*/}
  
            {!isInRange && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Position is out of range. Not earning fees.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
  