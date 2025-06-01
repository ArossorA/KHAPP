import { type ReactNode } from 'react'

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <div className="flex flex-col min-h-screen w-full">
            <div>Layout Dash</div>
            <div>{children}</div>
        </div>
    )
}
