export default function LoadingState({ message = 'Loading your workspace...' }: { message?: string }) {
  return <div className="loading-state"><span className="spinner" /><p>{message}</p></div>
}
