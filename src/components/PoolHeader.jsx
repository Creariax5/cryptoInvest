import { Card, CardHeader, CardTitle, CardContent } from "./ui/Card";

export const PoolHeader = ({ poolAddress, poolInfo, currentPrice }) => (
    <Card className="bg-gray-800">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center space-x-4">
          <CardTitle>
            Pool {poolAddress.slice(0, 6)}...{poolAddress.slice(-4)}
          </CardTitle>
          <div className="bg-blue-900 px-2 py-1 rounded text-sm">
            {((poolInfo?.fee || 0) / 10000).toFixed(2)}% Fee
          </div>
        </div>
        <div className="font-mono">
          ${currentPrice.toFixed(4)}
        </div>
      </CardHeader>
    </Card>
  );
  