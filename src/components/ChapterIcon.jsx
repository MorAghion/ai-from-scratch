import {
  RocketLaunch,
  Atom,
  Robot,
  PencilLine,
  MagnifyingGlass,
  Brain,
  Graph,
  ShieldCheck,
  Lightning,
  Package,
  Plugs,
  Detective,
  File,
  Usb,
  Cube,
  CodeBlock,
  TreeStructure,
  UsersThree,
  Gear,
  Flag,
} from '@phosphor-icons/react'

const iconMap = {
  RocketLaunch,
  Atom,
  Robot,
  PencilLine,
  MagnifyingGlass,
  Brain,
  Graph,
  ShieldCheck,
  Lightning,
  Package,
  Plugs,
  Detective,
  Usb,
  Cube,
  CodeBlock,
  TreeStructure,
  UsersThree,
  Gear,
  Flag,
}

export default function ChapterIcon({ name, color, size = 28, weight = 'duotone' }) {
  const Icon = iconMap[name]
  if (!Icon) return <File size={size} weight="duotone" />
  return <Icon size={size} color={color} weight={weight} />
}
