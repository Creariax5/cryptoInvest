import { Card, CardHeader, CardTitle, CardContent } from "./Card";

export const PositionConfig = ({ positionConfig, setPositionConfig }) => (
    <Card className="bg-gray-800">
      <CardHeader>
        <CardTitle className="text-lg">Position Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm text-gray-400">Deposit Amount (USD)</label>
          <input
            type="number"
            value={positionConfig.depositAmount}
            onChange={(e) => setPositionConfig(prev => ({
              ...prev,
              depositAmount: Number(e.target.value)
            }))}
            className="w-full bg-gray-700 rounded p-2 mt-1"
            min="0"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-400">Min Price</label>
            <input
              type="number"
              value={positionConfig.range.min}
              onChange={(e) => setPositionConfig(prev => ({
                ...prev,
                range: { ...prev.range, min: Number(e.target.value) }
              }))}
              className="w-full bg-gray-700 rounded p-2 mt-1"
              min="0"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400">Max Price</label>
            <input
              type="number"
              value={positionConfig.range.max}
              onChange={(e) => setPositionConfig(prev => ({
                ...prev,
                range: { ...prev.range, max: Number(e.target.value) }
              }))}
              className="w-full bg-gray-700 rounded p-2 mt-1"
              min="0"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
  