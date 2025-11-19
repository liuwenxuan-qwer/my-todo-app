'use client'

import { useState, useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'

interface Member {
  id: string
  name: string
  email: string
  isAdmin?: boolean
  isOnline?: boolean
  todayPublicEvents?: number
  joinedAt: string
}

export default function MemberList({
  members,
  selectedMembers,
  onSelectMember,
  onToggleAllMembers,
  filterMode,
  onToggleFilterMode,
}: {
  members: Member[]
  selectedMembers: Set<string>
  onSelectMember: (memberId: string, selected: boolean) => void
  onToggleAllMembers: (selected: boolean) => void
  filterMode: boolean
  onToggleFilterMode: (enabled: boolean) => void
}) {
  const sortedMembers = useMemo(() => {
    return [...members].sort((a, b) => {
      if ((a.isAdmin || false) !== (b.isAdmin || false)) {
        return (b.isAdmin || false) ? 1 : -1
      }
      if ((a.isOnline || false) !== (b.isOnline || false)) {
        return (b.isOnline || false) ? 1 : -1
      }
      return a.name.localeCompare(b.name)
    })
  }, [members])

  const displayedMembers = filterMode 
    ? sortedMembers.filter(m => selectedMembers.has(m.id))
    : sortedMembers

  return (
    <div className="bg-card rounded-lg border border-border h-full flex flex-col">
      <div className="p-4 border-b border-border space-y-3">
        <h3 className="font-semibold text-foreground text-sm">成员列表</h3>

        <div className="flex items-center justify-between gap-2 p-2 bg-secondary/50 rounded">
          <span className="text-xs text-muted-foreground">只看选中的成员</span>
          <Switch checked={filterMode} onCheckedChange={onToggleFilterMode} />
        </div>

        {members.length > 0 && (
          <div className="flex items-center gap-2">
            <Checkbox
              id="select-all"
              checked={selectedMembers.size === members.length}
              onCheckedChange={(checked) => onToggleAllMembers(checked as boolean)}
            />
            <label htmlFor="select-all" className="text-xs cursor-pointer text-muted-foreground">
              全选
            </label>
          </div>
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {displayedMembers.length === 0 ? (
            <p className="text-xs text-muted-foreground">暂无成员</p>
          ) : (
            displayedMembers.map((member) => (
              <div
                key={member.id}
                className="p-3 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors"
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    id={`member-${member.id}`}
                    checked={selectedMembers.has(member.id)}
                    onCheckedChange={(checked) =>
                      onSelectMember(member.id, checked as boolean)
                    }
                    className="mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <label
                        htmlFor={`member-${member.id}`}
                        className="text-sm font-medium text-foreground cursor-pointer truncate"
                      >
                        {member.name}
                      </label>
                      {member.isAdmin && (
                        <Badge variant="outline" className="text-xs">
                          管理员
                        </Badge>
                      )}
                      {member.isOnline && (
                        <div className="w-2 h-2 rounded-full bg-green-500" title="在线" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 truncate">{member.email}</p>
                  </div>

                  {member.todayPublicEvents !== undefined && member.todayPublicEvents > 0 && (
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      <span className="text-xs font-bold">{member.todayPublicEvents}</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
