import {
  Star,
  Car,
  Plane,
  Heart,
  Flame,
  Wallet,
  MessageCircle,
  Truck,
  Phone,
  Shield,
  ShieldCheck,
  ShieldPlus,
  Users,
  User,
  File,
  Download,
  Upload,
  Check,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  X,
  Clock,
  ArrowRight,
  ArrowUpRight,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Pause,
  Plus,
  Minus,
  Search,
  Filter,
  Copy,
  QrCode,
  Trophy,
  Medal,
  Gift,
  TrendingUp,
  Coins,
  Bell,
  FileText,
  MapPin,
  Sparkles,
  RefreshCw,
  Globe,
  Building2,
  Headset,
  Calendar,
  CreditCard,
  Package,
  Link2,
  Play,
  Image as ImageIcon,
  SquarePen,
  Megaphone,
  Map,
  Flag,
  Info,
  Lock,
  Eye,
  Target,
  Sun,
  LifeBuoy,
  Hospital,
  HeartPulse,
  PiggyBank,
  BadgeCheck,
  Handshake,
  Network,
  ShoppingCart,
  ClipboardList,
  HelpCircle,
  type LucideProps,
} from "lucide-react";

/**
 * Brand marks with no clean Lucide equivalent — kept as small inline SVGs,
 * drawn in the same stroke style as the original assets/icons.js set.
 */
function BrandSvg({
  size = 20,
  strokeWidth = 2,
  children,
  ...rest
}: LucideProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      {children}
    </svg>
  );
}

const Facebook = (props: LucideProps) => (
  <BrandSvg {...props}>
    <path d="M14 8.5h2V6h-2a3 3 0 0 0-3 3v2H9v2.5h2V21h2.5v-7.5H16L16.5 11H13.5V9.2c0-.4.3-.7.7-.7Z" />
  </BrandSvg>
);

const Line = (props: LucideProps) => (
  <BrandSvg {...props}>
    <rect x="3" y="3.5" width="18" height="15" rx="4.5" />
    <path
      d="M7 9v4M9.5 9v4M11.7 13V9l2.3 4V9M16.2 9h1.8M16.2 9v4h1.8M16.2 11h1.5"
      strokeWidth="1.6"
    />
  </BrandSvg>
);

/**
 * The original ICON name → component map. Replaces the global `ICON` string
 * map + `data-ic` pattern. `chat` is a speech bubble (MessageCircle), `doc`
 * is a lined document (FileText), `file` a plain file (File).
 */
const registry = {
  star: Star,
  car: Car,
  plane: Plane,
  heart: Heart,
  flame: Flame,
  wallet: Wallet,
  chat: MessageCircle,
  truck: Truck,
  facebook: Facebook,
  line: Line,
  phone: Phone,
  shield: Shield,
  shieldCheck: ShieldCheck,
  shieldPlus: ShieldPlus,
  users: Users,
  user: User,
  file: File,
  download: Download,
  upload: Upload,
  check: Check,
  checkCircle: CheckCircle2,
  alert: AlertCircle,
  alertTri: AlertTriangle,
  x: X,
  clock: Clock,
  arrowRight: ArrowRight,
  arrowUpRight: ArrowUpRight,
  chevR: ChevronRight,
  chevL: ChevronLeft,
  chevD: ChevronDown,
  pause: Pause,
  plus: Plus,
  minus: Minus,
  search: Search,
  filter: Filter,
  copy: Copy,
  qr: QrCode,
  trophy: Trophy,
  medal: Medal,
  gift: Gift,
  trend: TrendingUp,
  coins: Coins,
  bell: Bell,
  doc: FileText,
  pin: MapPin,
  sparkle: Sparkles,
  refresh: RefreshCw,
  globe: Globe,
  sos: LifeBuoy,
  building: Building2,
  headset: Headset,
  calendar: Calendar,
  creditcard: CreditCard,
  box: Package,
  link: Link2,
  play: Play,
  image: ImageIcon,
  edit: SquarePen,
  megaphone: Megaphone,
  map: Map,
  flag: Flag,
  hospital: Hospital,
  info: Info,
  lock: Lock,
  eye: Eye,
  target: Target,
  sun: Sun,
  heartPulse: HeartPulse,
  piggy: PiggyBank,
  badgeCheck: BadgeCheck,
  handshake: Handshake,
  network: Network,
  cart: ShoppingCart,
  clipboard: ClipboardList,
  help: HelpCircle,
} satisfies Record<string, React.ComponentType<LucideProps>>;

export type IconName = keyof typeof registry;

export type IconProps = {
  name: IconName;
  /** px (applied to width & height). Original default was 20. */
  size?: number;
  strokeWidth?: number;
  className?: string;
};

export function Icon({ name, size = 20, strokeWidth = 2, className }: IconProps) {
  const Glyph = registry[name];
  // Icons are decorative — interactive controls supply their own aria-label.
  // Hide from assistive tech to avoid duplicate/noise announcements.
  return (
    <Glyph
      size={size}
      strokeWidth={strokeWidth}
      className={className}
      aria-hidden="true"
      focusable={false}
    />
  );
}
