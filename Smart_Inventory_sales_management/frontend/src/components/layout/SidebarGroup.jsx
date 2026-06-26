import SidebarItem from "./SidebarItem";

import React from 'react'

const SidebarGroup = ({group}) => {
  return (
    <div className="mb-6">
        <p className="mb-2 px4 text-xs font-semibold uppercase tracking-wider text-gray">
            {group.title}
        </p>
        <div className="space-y-1">
            {group.items.map((item)=> {
                return <SidebarItem key={item.name} item={item} />
            })}
        </div>
    </div>
  )
}

export default SidebarGroup