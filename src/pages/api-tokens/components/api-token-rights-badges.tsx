import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type { Right } from '@/generated/client/types.gen'

const VISIBLE_COUNT = 4

interface ApiTokenRightsBadgesProps {
  rights?: Right[]
}

export function ApiTokenRightsBadges({
  rights = [],
}: ApiTokenRightsBadgesProps): React.ReactElement {
  const overflow = rights.slice(VISIBLE_COUNT)
  return (
    <div className="flex flex-wrap gap-1">
      {rights.slice(0, VISIBLE_COUNT).map(r => (
        <Badge key={r.authority} variant="secondary">
          {r.authority}
        </Badge>
      ))}
      {overflow.length > 0 && (
        <Tooltip>
          <TooltipTrigger
            render={
              <Badge variant="secondary" className="cursor-default">
                +{overflow.length}
              </Badge>
            }
          />
          <TooltipContent>
            {overflow.map(r => r.authority).join(', ')}
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  )
}
