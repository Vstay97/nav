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

interface IComponentBase {
  id: number
}

/** 日历组件（type 1） */
export interface ICalendarComponent extends IComponentBase {
  type: ComponentType.Calendar
  topColor?: string
  bgColor?: string
}

/** 下班倒计时组件（type 2） */
export interface IOffWorkComponent extends IComponentBase {
  type: ComponentType.OffWork
  workTitle?: string
  restTitle?: string
  startDate?: number
  date?: number
}

/** 运行时长组件（type 3） */
export interface IRuntimeComponent extends IComponentBase {
  type: ComponentType.Runtime
  title?: string
}

/** 图片组件（type 4） */
export interface IImageComponent extends IComponentBase {
  type: ComponentType.Image
  url?: string
  go?: string
  text?: string
}

/** 倒计时组件（type 5） */
export interface ICountdownComponent extends IComponentBase {
  type: ComponentType.Countdown
  topColor?: string
  bgColor?: string
  url?: string
  title?: string
  dateColor?: string
  dayColor?: string
  date?: number | string
}

/** 自定义 HTML 组件（type 6） */
export interface IHTMLComponent extends IComponentBase {
  type: ComponentType.HTML
  html?: string
}

/** 节假日组件（type 7） */
export interface IHolidayComponent extends IComponentBase {
  type: ComponentType.Holiday
  items?: Array<Record<string, unknown>>
}

/**
 * 页面小组件配置（判别联合：以 type 字段为判别式，
 * 组件模板/逻辑按 type 窄化后获得完整字段类型）
 */
export type IComponentProps =
  | ICalendarComponent
  | IOffWorkComponent
  | IRuntimeComponent
  | IImageComponent
  | ICountdownComponent
  | IHTMLComponent
  | IHolidayComponent

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

/** App 主题配置 */
export interface IAppThemeSettings {
  appCardStyle: ICardType
  appDocTitle: string
}

/** Light 主题配置 */
export interface ILightThemeSettings {
  lightCardStyle: ICardType
  lightOverType: OverType
  lightImages: IBannerImage[]
  lightFooterHTML: string
  lightDocTitle: string
}

/** Sim 主题配置 */
export interface ISimThemeSettings {
  simThemeImages: IBannerImage[]
  simThemeDesc: string
  simThemeHeight: number
  simThemeAutoplay: boolean
  simCardStyle: ICardType
  simTitle: string
  simOverType: OverType
  simFooterHTML: string
  simDocTitle: string
}

/** Side 主题配置 */
export interface ISideThemeSettings {
  sideThemeImages: IBannerImage[]
  sideThemeHeight: number
  sideThemeAutoplay: boolean
  sideCardStyle: ICardType
  sideTitle: string
  sideFooterHTML: string
  sideCollapsed: boolean
  sideDocTitle: string
}

/** Shortcut 主题配置 */
export interface IShortcutThemeSettings {
  shortcutThemeImages: IBannerImage[]
  shortcutThemeShowWeather: boolean
  shortcutTitle: string
  shortcutDockCount: number
  shortcutDocTitle: string
}

/** Super 主题配置 */
export interface ISuperThemeSettings {
  superTitle: string
  superOverType: OverType
  superCardStyle: ICardType
  superImages: IBannerImage[]
  superFooterHTML: string
  superDocTitle: string
}

/** 站点全局（跨主题）配置 */
export interface IBaseSettings {
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

/**
 * 站点全部设置（主题配置按主题分组的子接口组合；
 * 数据文件格式不变，仍为平铺键）
 */
export interface ISettings
  extends IBaseSettings,
    IAppThemeSettings,
    ILightThemeSettings,
    ISimThemeSettings,
    ISideThemeSettings,
    IShortcutThemeSettings,
    ISuperThemeSettings {}

export type internalProps = {
  loginViewCount: number
  userViewCount: number
}
