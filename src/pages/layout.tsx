import { Fragment, type ReactNode } from 'react'

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <Fragment>{children}</Fragment>
    )
}
