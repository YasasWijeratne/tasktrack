export default function Logo({ light = false }) {
  return <img className={`brand-logo${light ? ' light' : ''}`} src="/logo.svg" alt="" aria-hidden="true" />
}
