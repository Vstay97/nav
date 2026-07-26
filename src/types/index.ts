// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

export type ThemeType =
  | 'Current'
  | 'Light'
  | 'Sim'
  | 'Side'
  | 'Super'
  | 'App'
  | 'Shortcut'

export enum TopType {
  Side = 1,
  Shortcut,
}

export enum ComponentType {
  Calendar = 1,
  OffWork = 2,
  Runtime = 3,
  Image = 4,
  Countdown = 5,
  HTML = 6,
  Holiday = 7,
}

/**
 * 页面小组件配置（日历/下班/运行时长/图片/倒计时/HTML/节日）。
 * type 决定组件种类，其余字段按种类取用，故全部显式声明为可选。
 */
export interface IComponentProps {
  id: number
  type: ComponentType
  topColor?: string
  bgColor?: string
  workTitle?: string
  restTitle?: string
  startDate?: number
  date?: number | string
  title?: string
  url?: string
  go?: string
  text?: string
  html?: string
  items?: Array<Record<string, unknown>>
  dateColor?: string
  dayColor?: string
}

export type ICardType = 'standard' | 'column' | 'example' | 'retro' | 'original'

type OverType = 'overflow' | 'ellipsis'

type Spider = 'NO' | 'EMPTY' | 'ALWAYS'

/** 横幅/广告图片配置项 */
export interface IBannerImage {
  src: string
  url?: string
}

export interface ITagPropValues {
  id: number
  name: string
  color: string
  createdAt: string | number
  desc: string
  isInner: boolean
}

export interface ITagProp {
  [tagName: string]: ITagPropValues
}

export interface IWebTag {
  id: number | string
  url?: string
}

export interface IWebProps {
  __name__?: string // 搜索原name值
  __desc__?: string
  id: string | number
  name: string
  desc: string
  url: string
  icon: string
  createdAt: string | number
  rate?: number // 0-5
  top?: boolean
  topTypes?: number[]
  index?: number | string // sort
  ownVisible?: boolean
  breadcrumb: string[]
  ok?: boolean
  tags?: IWebTag[]
}

export interface INavThreeProp {
  title?: string
  icon?: string
  createdAt?: string | number
  collapsed?: boolean
  ownVisible?: boolean
  nav: IWebProps[]
}

export interface INavTwoProp {
  title?: string
  icon?: string
  createdAt?: string | number
  collapsed?: boolean
  ownVisible?: boolean
  nav: INavThreeProp[]
}

export interface INavProps {
  title: string
  id?: number
  icon?: string | null
  createdAt?: string | number
  ownVisible?: boolean
  collapsed?: boolean
  nav: INavTwoProp[]
}

export interface ISearchEngineProps {
  name: string
  url?: string
  icon: string | null
  placeholder?: string
  blocked: boolean
  isInner: boolean
}

export interface ISettings {
  favicon: string
  language: 'zh-CN' | 'en'
  loading: string
  title: string
  description: string
  keywords: string
  theme: ThemeType
  openSEO: boolean
  appTheme: ThemeType
  footerContent: string
  headerContent: string
  showGithub: boolean
  showLanguage: boolean
  showCopy?: boolean
  showShare?: boolean
  showThemeToggle: boolean
  actionUrl: string | null
  checkUrl: boolean
  errorUrlCount?: number

  appCardStyle: ICardType
  appDocTitle: string

  lightCardStyle: ICardType
  lightOverType: OverType
  lightImages: IBannerImage[]
  lightFooterHTML: string
  lightDocTitle: string

  simThemeImages: IBannerImage[]
  simThemeDesc: string
  simThemeHeight: number
  simThemeAutoplay: boolean
  simCardStyle: ICardType
  simTitle: string
  simOverType: OverType
  simFooterHTML: string
  simDocTitle: string

  sideThemeImages: IBannerImage[]
  sideThemeHeight: number
  sideThemeAutoplay: boolean
  sideCardStyle: ICardType
  sideTitle: string
  sideFooterHTML: string
  sideCollapsed: boolean
  sideDocTitle: string

  shortcutThemeImages: IBannerImage[]
  shortcutThemeShowWeather: boolean
  shortcutTitle: string
  shortcutDockCount: number
  shortcutDocTitle: string

  superTitle: string
  superOverType: OverType
  superCardStyle: ICardType
  superImages: IBannerImage[]
  superFooterHTML: string
  superDocTitle: string

  showRate: boolean

  allowCollect: boolean
  email: string

  spiderIcon: Spider
  spiderDescription: Spider
  spiderTitle: Spider
  spiderQty: number
  spiderTimeout: number | string

  loadingCode: string
  openSearch: boolean
  gitHubCDN: string
  components: IComponentProps[]

  runtime: number
}

export type internalProps = {
  loginViewCount: number
  userViewCount: number
}
