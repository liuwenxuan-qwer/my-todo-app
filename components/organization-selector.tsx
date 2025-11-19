'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Check, Plus } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'

interface Organization {
  id: string
  name: string
  inviteCode: string
  createdBy: string
  createdAt: string
  members: string[]
  isAdmin?: boolean
}

export default function OrganizationSelector({
  organizations,
  currentOrg,
  onSelectOrg,
  onCreateOrg,
  onJoinOrg,
}: {
  organizations: Organization[]
  currentOrg: Organization | null
  onSelectOrg: (org: Organization) => void
  onCreateOrg: (name: string, inviteCode: string) => void
  onJoinOrg: (inviteCode: string) => void
}) {
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showJoinDialog, setShowJoinDialog] = useState(false)
  const [orgName, setOrgName] = useState('')
  const [inviteCode, setInviteCode] = useState('')

  const handleCreate = () => {
    if (orgName.trim() && inviteCode.trim()) {
      onCreateOrg(orgName, inviteCode)
      setOrgName('')
      setInviteCode('')
      setShowCreateDialog(false)
    }
  }

  const handleJoin = () => {
    if (inviteCode.trim()) {
      onJoinOrg(inviteCode)
      setInviteCode('')
      setShowJoinDialog(false)
    }
  }

  return (
    <div className="bg-card rounded-lg border border-border h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold text-foreground text-sm">我的组织</h3>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {organizations.length === 0 ? (
            <p className="text-xs text-muted-foreground">暂无组织</p>
          ) : (
            organizations.map((org) => (
              <div
                key={org.id}
                onClick={() => onSelectOrg(org)}
                className={`p-3 rounded-lg cursor-pointer transition-all ${
                  currentOrg?.id === org.id
                    ? 'bg-primary/20 border border-primary'
                    : 'bg-secondary/50 hover:bg-secondary border border-transparent'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-sm font-medium ${
                      currentOrg?.id === org.id
                        ? 'text-primary font-bold'
                        : 'text-foreground'
                    }`}
                  >
                    {org.name}
                  </span>
                  {currentOrg?.id === org.id && (
                    <Check className="w-4 h-4 text-primary" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {org.members.length} 成员
                </p>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      <div className="p-4 space-y-2 border-t border-border">
        <Button
          onClick={() => setShowJoinDialog(true)}
          variant="outline"
          size="sm"
          className="w-full text-xs"
        >
          <Plus className="w-3 h-3 mr-1" />
          加入组织
        </Button>
        <Button
          onClick={() => setShowCreateDialog(true)}
          variant="outline"
          size="sm"
          className="w-full text-xs"
        >
          <Plus className="w-3 h-3 mr-1" />
          创建组织
        </Button>
      </div>

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>创建新组织</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-2 block">
                组织名称
              </label>
              <Input
                placeholder="输入组织名称"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-2 block">
                邀请码
              </label>
              <Input
                placeholder="输入邀请码"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowCreateDialog(false)}
                className="flex-1"
              >
                取消
              </Button>
              <Button
                onClick={handleCreate}
                className="flex-1 bg-primary text-primary-foreground"
              >
                创建
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showJoinDialog} onOpenChange={setShowJoinDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>加入组织</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-2 block">
                邀请码
              </label>
              <Input
                placeholder="输入邀请码"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowJoinDialog(false)}
                className="flex-1"
              >
                取消
              </Button>
              <Button
                onClick={handleJoin}
                className="flex-1 bg-primary text-primary-foreground"
              >
                加入
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
