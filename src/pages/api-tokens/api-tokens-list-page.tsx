import { getRouteApi } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import { AllApiTokensView } from './components/all-api-tokens-view'
import { MyApiTokensView } from './components/my-api-tokens-view'

import { PageHeader } from '@/components/layout/page-header'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { usePermissions } from '@/hooks/use-permissions'
import { RIGHTS } from '@/lib/permissions'

const route = getRouteApi('/_authenticated/api-tokens')

const tabValues = { allTokens: 'allTokens', myTokens: 'myTokens' } as const

type TabValue = keyof typeof tabValues

export function ApiTokensListPage(): React.ReactElement | null {
  const { t } = useTranslation()
  const { can } = usePermissions()
  const canSelf = can(RIGHTS.API_TOKEN)
  const canAdmin = can(RIGHTS.API_TOKEN_ADMIN)

  const { tab } = route.useSearch()

  const activeTab = tab ?? tabValues.myTokens

  const navigate = route.useNavigate()

  if (canSelf && canAdmin) {
    return (
      <div className="space-y-6 p-6">
        <PageHeader title={t('apiTokens.title')} />
        <Tabs
          value={activeTab}
          onValueChange={value => {
            void navigate({
              search: prev => ({
                ...prev,
                tab: value as TabValue,
                page: 0,
              }),
            })
          }}
        >
          <TabsList variant="line">
            <TabsTrigger value={tabValues.myTokens}>
              {t('apiTokens.admin.tabMy')}
            </TabsTrigger>
            <TabsTrigger value={tabValues.allTokens}>
              {t('apiTokens.admin.tabAll')}
            </TabsTrigger>
          </TabsList>
          <TabsContent value={tabValues.myTokens}>
            <MyApiTokensView hideTitle />
          </TabsContent>
          <TabsContent value={tabValues.allTokens}>
            <AllApiTokensView hideTitle />
          </TabsContent>
        </Tabs>
      </div>
    )
  }

  if (canAdmin) {
    return (
      <div className="p-6">
        <AllApiTokensView />
      </div>
    )
  }

  if (canSelf) {
    return (
      <div className="p-6">
        <MyApiTokensView />
      </div>
    )
  }

  // Unreachable in practice: the route guard redirects users holding neither
  // right. Handled explicitly so the component never guesses a view.
  return null
}
