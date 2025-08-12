import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { GoHome } from "react-icons/go";
import {
  FaStore,
  FaTrash,
  FaHistory,
  FaBook,
  FaBarcode,
  FaRegMoneyBillAlt,
} from "react-icons/fa";
import { FaSitemap } from "react-icons/fa6";
import {
  MdOutlineProductionQuantityLimits,
  MdPeople,
  MdOutlinePointOfSale,
  MdOutlineHistoryToggleOff,
} from "react-icons/md";
import { GiHamburgerMenu, GiBanknote } from "react-icons/gi";
import { TbReport } from "react-icons/tb";
import { IoMdNotifications } from "react-icons/io";
import { IoExitOutline, IoPerson } from "react-icons/io5";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { FaList } from "react-icons/fa";
import { FiX } from "react-icons/fi";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

const Sidebar = () => {
  const menuRef = useRef(null);
  const items = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const url = useLocation().pathname;
  const [role, setRole] = useState("");
  const [rate, setRate] = useState(0);
  useEffect(() => {
    const role = window.localStorage.getItem("role");
    setRole(role);
    fetch("https://api.exchangerate-api.com/v4/latest/TRY")
      .then((response) => response.json())
      .then((data) => {
        const tryToUsd = data.rates.USD;
        const tryToEur = data.rates.EUR;

        // console.log(`1 TL = ${tryToUsd} USD`);
        // console.log(`1 TL = ${tryToEur} EUR`);

        // 1 USD ve 1 EUR kaç TL olduğunu hesaplamak için
        const usdToTry = 1 / tryToUsd;
        const eurToTry = 1 / tryToEur;

        // console.log(`1 USD = ${usdToTry.toFixed(4)} TL`);
        // console.log(`1 EUR = ${eurToTry.toFixed(4)} TL`);

        setRate({
          usd: usdToTry.toFixed(4),
          eur: eurToTry.toFixed(4),
        });
      })
      .catch((error) => console.error("Hata:", error));
  }, []);

  const LogoutHandel = () => {
    window.localStorage.clear();
    window.location.href = "/";
  };

  const menuToggle = (e) => {
    e?.stopPropagation();
    setIsOpen(!isOpen);
  };

  // URL değiştiğinde menüyü kapat
  useEffect(() => {
    setIsOpen(false);
  }, [url]);

  // Dışarı tıklandığında menüyü kapat
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const linkClass = ({ isActive }) =>
    isActive
      ? "flex items-center gap-3 p-3 text-indigo-600 bg-indigo-50 rounded-lg transition-all"
      : "flex items-center gap-3 p-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-all";

  const menuButtonClass =
    "flex items-center justify-between w-full p-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-all";

  const SalesLinks = [
    {
      to: "/dashboard/sales",
      label: "Satış",
      icon: "FaRegMoneyBillAlt",
      iconSize: 20,
    },
    {
      to: "/dashboard/return",
      label: "İade",
      icon: "GiBanknote",
      iconSize: 20,
    },
    {
      to: "/dashboard/casualty",
      label: "Zayiyat",
      icon: "FaTrash",
      iconSize: 18,
    },
    // {
    //     to: "/dashboard/history",
    //     label: "Geçmiş",
    //     icon: "FaHistory",
    //     iconSize: 18
    // },
    {
      to: "/dashboard/tick",
      label: "Veresiye",
      icon: "FaBook",
      iconSize: 18,
    },
    {
      to: "/dashboard/barcode",
      label: "Barkod Oluştur",
      icon: "FaBarcode",
      iconSize: 20,
    },
  ];
  const ProductLinks = [
    {
      to: "/dashboard/products",
      label: "Ürünler",
      icon: "MdOutlineProductionQuantityLimits",
      iconSize: 20,
      role: "admin",
    },
    {
      to: "/dashboard/productsHistory",
      label: "Ürün Geçmişi",
      icon: "FaHistory",
      iconSize: 20,
      role: "admin",
    },
    {
      to: "/dashboard/list",
      label: "Alınacaklar",
      icon: "FaList",
      iconSize: 20,
      role: "admin",
    },
    {
      to: "/dashboard/storeHistory",
      label: "Geçmiş Satın alım",
      icon: "MdOutlineHistoryToggleOff",
      iconSize: 20,
      role: "admin",
    },
  ];
  const StoreLinks = [
    {
      to: "/dashboard/store",
      label: "Depo Ayarları",
      icon: "FaStore",
      iconSize: 20,
      role: "admin",
    },
    {
      to: "/dashboard/storeDetail",
      label: "Depo İçerik",
      icon: "FaSitemap",
      iconSize: 20,
      role: "admin",
    },
  ];
  const ReportLinks = [
    {
      to: "/dashboard/report",
      label: "Raporlama",
      icon: "TbReport",
      iconSize: 20,
      role: "admin",
    },
    {
      to: "/dashboard/statistics",
      label: "İstatislikler",
      icon: "TbReport",
      iconSize: 20,
      role: "admin",
    },
  ];

  const GeneralLinks = [
    {
      to: "/dashboard/notification",
      label: "Bildirim Ayarları",
      icon: "IoMdNotifications",
      iconSize: 20,
      role: "admin",
    },
    {
      to: "/dashboard/users",
      label: "Personel Ayarları",
      icon: "MdPeople",
      iconSize: 20,
      role: "admin",
    },
    {
      to: "/dashboard/profile",
      label: "Profil Ayarları",
      icon: "IoPerson",
      iconSize: 20,
      role: "admin",
    },
  ];

  const Generalİcon = {
    IoMdNotifications: IoMdNotifications,
    MdPeople: MdPeople,
    IoPerson: IoPerson,
  };

  const Reportİcon = {
    TbReport: TbReport,
  };
  const Storeİcon = {
    FaStore: FaStore,
    FaSitemap: FaSitemap,
  };

  const Productİcon = {
    MdOutlineProductionQuantityLimits: MdOutlineProductionQuantityLimits,
    FaHistory: FaHistory,
    FaList: FaList,
    MdOutlineHistoryToggleOff: MdOutlineHistoryToggleOff,
  };
  const Salesicon = {
    FaRegMoneyBillAlt: FaRegMoneyBillAlt,
    GiBanknote: GiBanknote,
    FaTrash: FaTrash,
    FaHistory: FaHistory,
    FaBook: FaBook,
    FaBarcode: FaBarcode,
  };

  return (
    <>
      {/* Hamburger Menu Button - When Closed */}
      {!isOpen && (
        <button
          onClick={menuToggle}
          className="fixed top-4 left-4 z-30 p-2 bg-white rounded-lg shadow-lg border border-gray-200"
        >
          <GiHamburgerMenu className="w-6 h-6 text-gray-600" />
        </button>
      )}

      {/* Sidebar */}
      <div
        ref={menuRef}
        className={`fixed inset-y-0 left-0 z-20 w-64 bg-white border-r border-gray-200 shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close Button - When Open */}
        <button
          onClick={menuToggle}
          className={`absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 transition-all ${
            isOpen ? "block" : "hidden"
          }`}
        >
          <FiX className="w-6 h-6 text-gray-600" />
        </button>

        {/* Sidebar Content */}
        <div className="flex flex-col h-full">
          {/* Logo/Brand Area */}
          <div className="p-4 border-b flex flex-col gap-2  items-start justify-start border-gray-200 mt-4">
            <h1 className="text-xl font-bold text-gray-800">Yönetim Paneli</h1>
            <span className="w-full flex flex-col items-start justify-start gap-2">
              <span className="text-sm flex gap-2 text-gray-600 capitalize">
                <p className="font-bold">Kullanıcı Adı: </p>
                <p>{window.localStorage.getItem("user")}</p>
              </span>
              <span className="text-sm flex gap-2 text-gray-600 capitalize">
                <p className="font-bold">Tarih: </p>
                <p>{new Date().toLocaleDateString()}</p>
              </span>
              <span className="text-sm flex gap-2 text-gray-600 capitalize">
                <p className="font-bold">Güncel Dolar: </p>
                <p>{rate.usd} TL</p>
              </span>
              <span className="text-sm flex gap-2 text-gray-600 capitalize">
                <p className="font-bold">Güncel Euro: </p>
                <p>{rate.eur} TL</p>
              </span>
            </span>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 px-3 py-4 overflow-y-auto">
            {/* Ana Sayfa */}
            <div className="mb-4">
              <NavLink
                to={
                  role === "admin" ? "/dashboard/panel" : "/dashboard/userPanel"
                }
                className={linkClass}
              >
                <GoHome className="w-5 h-5" />
                <span>Ana Sayfa</span>
              </NavLink>
            </div>

            {/* Menu Groups */}
            {role === "admin" && (
              <div className="mb-4">
                <Menu>
                  {({ open }) => (
                    <>
                      <MenuButton
                        className={`${menuButtonClass} ${
                          open ? "bg-gray-50" : ""
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <MdOutlinePointOfSale className="w-5 h-5" />
                          <span>Satış Ayarları</span>
                        </div>
                      </MenuButton>
                      <MenuItems className="mt-1 space-y-1 pl-8">
                        {SalesLinks.map((link, index) => {
                          const IconComponent = Salesicon[link.icon];
                          return (
                            <MenuItem key={index} as="div">
                              <NavLink to={link.to} className={linkClass}>
                                <IconComponent className="w-5 h-5" />
                                <span>{link.label}</span>
                              </NavLink>
                            </MenuItem>
                          );
                        })}
                      </MenuItems>
                    </>
                  )}
                </Menu>
              </div>
            )}

            {/* Ürün Ayarları */}
            <div className="mb-4">
              <Menu>
                <MenuButton className={menuButtonClass}>
                  <div className="flex items-center gap-3">
                    <MdOutlineProductionQuantityLimits className="w-5 h-5" />
                    <span>Ürün Ayarları</span>
                  </div>
                </MenuButton>
                <MenuItems className="mt-1 space-y-1 pl-8">
                  {ProductLinks.filter((link) => role === link.role).map(
                    (link, index) => {
                      const IconComponent = Productİcon[link.icon];
                      return (
                        <NavLink key={index} to={link.to} className={linkClass}>
                          <IconComponent className="w-5 h-5" />
                          <span>{link.label}</span>
                        </NavLink>
                      );
                    }
                  )}
                </MenuItems>
              </Menu>
            </div>

            {/* Kategori Ayarları */}
            {role === "admin" && (
              <div className="mb-4">
                <NavLink to="/dashboard/categories" className={linkClass}>
                  <BiSolidCategoryAlt className="w-5 h-5" />
                  <span>Kategori Ayarları</span>
                </NavLink>
              </div>
            )}

            {/* Depo Ayarları */}
            {role === "admin" && (
              <div className="mb-4">
                <Menu>
                  <MenuButton className={menuButtonClass}>
                    <div className="flex items-center gap-3">
                      <FaStore className="w-5 h-5" />
                      <span>Depo Ayarları</span>
                    </div>
                  </MenuButton>
                  <MenuItems className="mt-1 space-y-1 pl-8">
                    {StoreLinks.filter((link) => role === link.role).map(
                      (link, index) => {
                        const IconComponent = Storeİcon[link.icon];
                        return (
                          <NavLink
                            key={index}
                            to={link.to}
                            className={linkClass}
                          >
                            <IconComponent className="w-5 h-5" />
                            <span>{link.label}</span>
                          </NavLink>
                        );
                      }
                    )}
                  </MenuItems>
                </Menu>
              </div>
            )}

            {/* Raporlamalar */}
            <div className="mb-4">
              <Menu>
                <MenuButton className={menuButtonClass}>
                  <div className="flex items-center gap-3">
                    <TbReport className="w-5 h-5" />
                    <span>Raporlamalar</span>
                  </div>
                </MenuButton>
                <MenuItems className="mt-1 space-y-1 pl-8">
                  {ReportLinks.filter((link) => role === link.role).map(
                    (link, index) => {
                      const IconComponent = Reportİcon[link.icon];
                      return (
                        <NavLink key={index} to={link.to} className={linkClass}>
                          <IconComponent className="w-5 h-5" />
                          <span>{link.label}</span>
                        </NavLink>
                      );
                    }
                  )}
                </MenuItems>
              </Menu>
            </div>

            {/* Genel Ayarlar */}
            {GeneralLinks.filter((link) => role === link.role).map(
              (link, index) => {
                const IconComponent = Generalİcon[link.icon];
                return (
                  <div key={index} className="mb-4">
                    <NavLink to={link.to} className={linkClass}>
                      <IconComponent className="w-5 h-5" />
                      <span>{link.label}</span>
                    </NavLink>
                  </div>
                );
              }
            )}
          </div>

          {/* Logout Button */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={LogoutHandel}
              className="flex items-center gap-3 w-full p-3 text-red-600 hover:bg-red-50 rounded-lg transition-all"
            >
              <IoExitOutline className="w-5 h-5" />
              <span>Çıkış Yap</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={menuToggle}
        />
      )}
    </>
  );
};

export default Sidebar;
