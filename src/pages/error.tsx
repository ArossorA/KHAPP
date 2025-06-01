import { type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Error({ children }: { children: ReactNode }) {
    const navigate = useNavigate();
    return (
        <div className="flex flex-col min-h-screen w-full bg-red-500 text-white">
            <div className="text-2xl font-bold text-center">Error</div>
            <div className="text-lg font-bold text-center">เกิดข้อผิดพลาดในการโหลดหน้านี้</div>
            <div className="text-lg font-bold text-center">
                <button
                    type="button"
                    className=" bg-red-700 px-8 py-2 rounded-lg shadow hover:bg-red-900 cursor-pointer "
                    onClick={() => navigate('/')}
                >
                    กลับหน้าหลัก
                </button>
            </div>
            <div className="text-lg font-bold text-center">{children}</div>
        </div>
    )
}
