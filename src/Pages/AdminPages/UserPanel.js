import React from 'react'
import Container from '../../Components/Container'
import { Link } from 'react-router-dom'
import { FaRegMoneyBillAlt, FaTrash, FaBarcode } from "react-icons/fa";
import { GiBanknote } from "react-icons/gi";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { HiOutlineDocumentReport } from "react-icons/hi";

const panels = [
  {
    to: '/dashboard/sales',
    color: 'from-green-400 to-green-600',
    icon: <FaRegMoneyBillAlt size={38} />,
    label: 'Satış'
  },
  {
    to: '/dashboard/return',
    color: 'from-yellow-400 to-yellow-600',
    icon: <GiBanknote size={38} />,
    label: 'İade'
  },
  {
    to: '/dashboard/casualty',
    color: 'from-red-400 to-red-600',
    icon: <FaTrash size={38} />,
    label: 'Zaiat'
  },
  {
    to: '/dashboard/products',
    color: 'from-indigo-400 to-indigo-600',
    icon: <MdOutlineProductionQuantityLimits size={38} />,
    label: 'Ürünler'
  },
  {
    to: '/dashboard/daily',
    color: 'from-blue-400 to-blue-600',
    icon: <HiOutlineDocumentReport size={38} />,
    label: 'Günlük Durum'
  },
  {
    to: '/dashboard/barcode',
    color: 'from-purple-400 to-purple-600',
    icon: <FaBarcode size={38} />,
    label: 'Barkod Oluştur'
  }
];

const UserPanel = () => {
  return (
    <Container padding>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
        {panels.map((panel, i) => (
          <Link
            key={i}
            to={panel.to}
            className={`
              flex flex-col items-center justify-center gap-4
              bg-gradient-to-br ${panel.color}
              rounded-2xl shadow-lg text-white min-h-48 py-8 px-4
              transition-transform duration-200 hover:scale-105 hover:shadow-2xl
              focus:outline-none
            `}
          >
            <div className="mb-2">{panel.icon}</div>
            <span className="text-2xl font-bold tracking-wide">{panel.label}</span>
          </Link>
        ))}
      </div>
    </Container>
  )
}

export default UserPanel