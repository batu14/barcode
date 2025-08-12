import Container from "../../Components/Container";
import {
  FaCamera,
  FaBarcode,
  FaChevronDown,
  FaCheck,
  FaTrash,
  FaBasketShopping,
} from "react-icons/fa6";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import React, { useEffect, useRef, useState } from "react";
import { BarcodeScanner, useTorch } from "react-barcode-scanner";
import "react-barcode-scanner/polyfill";
import SalesCard from "../../Components/SalesCard";
import toast, { Toaster } from "react-hot-toast";
import { FaTimes } from "react-icons/fa";
const Sales = () => {
  const ref = React.useRef(null);
  const ref2 = React.useRef(null);
  const ref3 = React.useRef(null);
  const ref4 = React.useRef(null);
  const barcodeText = useRef();
  const sellBtn = useRef(null);
  const [count, setCount] = useState(1);
  const [open, setOpen] = useState(false);
  const [modal, setModal] = useState(false);
  const [barcode, setBarcode] = useState("");
  const [basket, setBasket] = useState(
    window.localStorage.getItem("basket")
      ? JSON.parse(window.localStorage.getItem("basket"))
      : []
  );
  const [b2, setB2] = useState(
    window.localStorage.getItem("basket2")
      ? JSON.parse(window.localStorage.getItem("basket2"))
      : []
  );
  const [b3, setB3] = useState(
    window.localStorage.getItem("basket3")
      ? JSON.parse(window.localStorage.getItem("basket3"))
      : []
  );
  const [b4, setB4] = useState(
    window.localStorage.getItem("basket4")
      ? JSON.parse(window.localStorage.getItem("basket4"))
      : []
  );
  const [selectedBasket, setSelectedBasket] = useState(0);
  const [total, setTotal] = useState(1);
  const [isSupportTorch, , onTorchSwitch] = useTorch();
  const [alert, setAlert] = useState();
  const [type, setType] = useState(false);
  const [type2, setType2] = useState(false);
  const [type3, setType3] = useState(false);
  const [type4, setType4] = useState(false);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [discount2, setDiscount2] = useState(0);
  const [discount3, setDiscount3] = useState(0);
  const [discount4, setDiscount4] = useState(0);
  const [per, setPer] = useState(0);
  const [per2, setPer2] = useState(0);
  const [per3, setPer3] = useState(0);
  const [per4, setPer4] = useState(0);


  const sellHandel = () => {
    setModal(true);
  };

  const totalHandel = () => {
    switch (selectedBasket) {
      case 0:
        if (type == true) {
          let total = 0;
          basket.map((item) => {
            total += item.price * item.count;
          });

          let d = (total * per) / 100;

          return total - d;
        } else {
          let total = 0;
          basket.map((item) => {
            total += item.price * item.count;
          });
          return total - discount;
        }

      case 1:
        if (type2 == true) {
          let total = 0;
          b2.map((item) => {
            total += item.price * item.count;
          });

          let d = (total * per2) / 100;

          return total - d;
        } else {
          let total = 0;
          b2.map((item) => {
            total += item.price * item.count;
          });
          return total - discount2;
        }
      case 2:
        if (type3 == true) {
          let total = 0;
          b3.map((item) => {
            total += item.price * item.count;
          });

          let d = (total * per3) / 100;

          return total - d;
        } else {
          let total = 0;
          b3.map((item) => {
            total += item.price * item.count;
          });
          return total - discount3;
        }
      case 3:
        if (type4 == true) {
          let total = 0;
          b4.map((item) => {
            total += item.price * item.count;
          });

          let d = (total * per4) / 100;

          return total - d;
        } else {
          let total = 0;
          b4.map((item) => {
            total += item.price * item.count;
          });
          return total - discount4;
        }
    }
  };

  const basketLenght = (basket) => {
    let total = 0;
    basket &&
      basket.map((item) => {
        total += item.count;
      });

    return total;
  };

  const perCalc = (basket, per) => {
    let total = 0;
    basket &&
      basket.map((item) => {
        total += item.price * item.count;
      });

    return (total * per) / 100;
  };

  const fetchHandel = () => {
    setLoading(true);
    const formdata = new FormData();
    formdata.append("action", "sell");
    formdata.append("total", totalHandel());
    {
      selectedBasket == 0 &&
        formdata.append(
          "discount",
          type == true
            ? perCalc(basket, per) / basketLenght(basket)
            : discount / basketLenght(basket)
        );
    }
    {
      selectedBasket == 1 &&
        formdata.append(
          "discount",
          type2 == true
            ? perCalc(b2, per3) / basketLenght(b2)
            : discount2 / basketLenght(b2)
        );
    }
    {
      selectedBasket == 2 &&
        formdata.append(
          "discount",
          type3 == true
            ? perCalc(b3, per3) / basketLenght(b3)
            : discount3 / basketLenght(b3)
        );
    }
    {
      selectedBasket == 3 &&
        formdata.append(
          "discount",
          type4 == true
            ? perCalc(b4, per4) / basketLenght(b4)
            : discount4 / basketLenght(b4)
        );
    }
    formdata.append(
      "user",
      window.localStorage.getItem("user")
        ? window.localStorage.getItem("user")
        : "Anonim"
    );
    formdata.append("date", new Date().toLocaleDateString());
    formdata.append("time", new Date().toLocaleTimeString());
    {
      selectedBasket == 0 && formdata.append("basket", JSON.stringify(basket));
    }
    {
      selectedBasket == 1 && formdata.append("basket", JSON.stringify(b2));
    }
    {
      selectedBasket == 2 && formdata.append("basket", JSON.stringify(b3));
    }
    {
      selectedBasket == 3 && formdata.append("basket", JSON.stringify(b4));
    }
    fetch(process.env.REACT_APP_BASE_URL + "sales.php", {
      method: "POST",
      body: formdata,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status != 400) {
          setLoading(false);
          toast.success("Satış Başarılı");
          setAlert(data.alert);
          setModal(false);
          setTotal(0);
          setDiscount(0);
          setBarcode("");
          switch (selectedBasket) {
            case 0:
              setBasket([]);
              break;

            case 1:
              setB2([]);
              break;

            case 2:
              setB3([]);
              break;

            case 3:
              setB4([]);
              break;
          }
        } else {
          setLoading(false);
          toast.error("Satış Başarısız");
        }
      });
  };
  const onCapture = (detected) => {
    switch (selectedBasket) {
      case 0:
        if (detected) {
          const formdata = new FormData();
          formdata.append("action", "findByBarcode");
          formdata.append("barcode", detected.rawValue);
          fetch(process.env.REACT_APP_BASE_URL + "product.php", {
            method: "POST",
            body: formdata,
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.status != 400) {
                try {
                  const itemCount = basket.filter(
                    (item) => item.barcode === detected.rawValue
                  ).length;
                  if (itemCount > 0) {
                    const index = basket.findIndex(
                      (item) => item.barcode === detected.rawValue
                    );
                    if (count > 1) {
                      basket[index].count =
                        basket[index].count + parseInt(count);
                      setTotal(
                        (prev) =>
                          prev + parseInt(basket[index].price) * parseInt(count)
                      );
                    } else {
                      basket[index].count += 1;
                      setTotal((prev) => prev + parseInt(basket[index].price));
                    }
                    setBasket([...basket]);
                    setOpen(false);
                    setBarcode(detected.rawValue);
                  } else {
                    const p = parseInt(data.data.price);
                    setBasket([
                      ...basket,
                      {
                        barcode: detected.rawValue,
                        name: data.data.name,
                        image: data.data.image,
                        cost: data.data.cost,
                        count: count,
                        price: p,
                        store: data.data.store,
                        category: data.data.category,
                      },
                    ]);
                    setTotal(total + p);
                  }

                  setOpen(false);

                  setBarcode(detected.rawValue);
                  ref.current.focus();
                } catch (error) {
                  console.log(error);
                }
              } else {
                const role = window.localStorage.getItem("role");
                if (role === "admin") {
                  window.location.href = "/dashboard/addProduct";
                } else {
                  toast.error("Ürün Bulunamadı");
                }
              }
            });
        }

        break;

      case 1:
        if (detected) {
          const formdata = new FormData();
          formdata.append("action", "findByBarcode");
          formdata.append("barcode", detected.rawValue);
          fetch(process.env.REACT_APP_BASE_URL + "product.php", {
            method: "POST",
            body: formdata,
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.status != 400) {
                try {
                  const itemCount = b2.filter(
                    (item) => item.barcode === detected.rawValue
                  ).length;
                  if (itemCount > 0) {
                    const index = b2.findIndex(
                      (item) => item.barcode === detected.rawValue
                    );
                    if (count > 1) {
                      b2[index].count = b2[index].count + parseInt(count);
                      setTotal(
                        (prev) =>
                          prev + parseInt(b2[index].price) * parseInt(count)
                      );
                    } else {
                      b2[index].count += 1;
                      setTotal((prev) => prev + parseInt(b2[index].price));
                    }
                    setB2([...b2]);
                    setOpen(false);
                    setBarcode(detected.rawValue);
                  } else {
                    const p = parseInt(data.data.price);
                    setB2([
                      ...b2,
                      {
                        barcode: detected.rawValue,
                        name: data.data.name,
                        image: data.data.image,
                        cost: data.data.cost,
                        count: count,
                        price: p,
                        store: data.data.store,
                        category: data.data.category,
                      },
                    ]);
                    setTotal(total + p);
                  }

                  setOpen(false);

                  setBarcode(detected.rawValue);
                  ref2.current.focus();
                } catch (error) {
                  console.log(error);
                }
              } else {
                const role = window.localStorage.getItem("role");
                if (role === "admin") {
                  window.location.href = "/dashboard/addProduct";
                } else {
                  toast.error("Ürün Bulunamadı");
                }
              }
            });
        }

        break;

      case 2:
        if (detected) {
          const formdata = new FormData();
          formdata.append("action", "findByBarcode");
          formdata.append("barcode", detected.rawValue);
          fetch(process.env.REACT_APP_BASE_URL + "product.php", {
            method: "POST",
            body: formdata,
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.status != 400) {
                try {
                  const itemCount = b3.filter(
                    (item) => item.barcode === detected.rawValue
                  ).length;
                  if (itemCount > 0) {
                    const index = b3.findIndex(
                      (item) => item.barcode === detected.rawValue
                    );
                    if (count > 1) {
                      b3[index].count = b3[index].count + parseInt(count);
                      setTotal(
                        (prev) =>
                          prev + parseInt(b3[index].price) * parseInt(count)
                      );
                    } else {
                      b3[index].count += 1;
                      setTotal((prev) => prev + parseInt(b3[index].price));
                    }
                    setB3([...b2]);
                    setOpen(false);
                    setBarcode(detected.rawValue);
                  } else {
                    const p = parseInt(data.data.price);
                    setB3([
                      ...b3,
                      {
                        barcode: detected.rawValue,
                        name: data.data.name,
                        image: data.data.image,
                        cost: data.data.cost,
                        count: count,
                        price: p,
                        store: data.data.store,
                        category: data.data.category,
                      },
                    ]);
                    setTotal(total + p);
                  }

                  setOpen(false);

                  setBarcode(detected.rawValue);
                  ref3.current.focus();
                } catch (error) {
                  console.log(error);
                }
              } else {
                const role = window.localStorage.getItem("role");
                if (role === "admin") {
                  window.location.href = "/dashboard/addProduct";
                } else {
                  toast.error("Ürün Bulunamadı");
                }
              }
            });
        }

        break;

      case 3:
        if (detected) {
          const formdata = new FormData();
          formdata.append("action", "findByBarcode");
          formdata.append("barcode", detected.rawValue);
          fetch(process.env.REACT_APP_BASE_URL + "product.php", {
            method: "POST",
            body: formdata,
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.status != 400) {
                try {
                  const itemCount = b4.filter(
                    (item) => item.barcode === detected.rawValue
                  ).length;
                  if (itemCount > 0) {
                    const index = b4.findIndex(
                      (item) => item.barcode === detected.rawValue
                    );
                    if (count > 1) {
                      b4[index].count = b4[index].count + parseInt(count);
                      setTotal(
                        (prev) =>
                          prev + parseInt(b4[index].price) * parseInt(count)
                      );
                    } else {
                      b4[index].count += 1;
                      setTotal((prev) => prev + parseInt(b4[index].price));
                    }
                    setB4([...b4]);
                    setOpen(false);
                    setBarcode(detected.rawValue);
                  } else {
                    const p = parseInt(data.data.price);
                    setB4([
                      ...b4,
                      {
                        barcode: detected.rawValue,
                        name: data.data.name,
                        image: data.data.image,
                        cost: data.data.cost,
                        count: count,
                        price: p,
                        store: data.data.store,
                        category: data.data.category,
                      },
                    ]);
                    setTotal(total + p);
                  }

                  setOpen(false);

                  setBarcode(detected.rawValue);
                  ref4.current.focus();
                } catch (error) {
                  console.log(error);
                }
              } else {
                const role = window.localStorage.getItem("role");
                if (role === "admin") {
                  window.location.href = "/dashboard/addProduct";
                } else {
                  toast.error("Ürün Bulunamadı");
                }
              }
            });
        }

        break;
    }
  };

  const handleProductNotFound = () => {
    const role = window.localStorage.getItem("role");
    if (role === "admin") {
      const c = window.confirm("Ürün Bulunamadı, Eklemek ister misiniz?");
      if (c) {
        window.location.href = "/dashboard/addProduct";
      }
    } else {
      toast.error("Ürün Bulunamadı");
    }
  };

  const basketHandel = (id) => {
    setCount(1);
    setSelectedBasket(id);
  };

  const keyHandel = (e) => {
    switch (selectedBasket) {
      case 0:
        if (e.key === "Enter") {
          const formdata = new FormData();
          formdata.append("action", "findByBarcode");
          formdata.append("barcode", barcode);
          fetch(process.env.REACT_APP_BASE_URL + "product.php", {
            method: "POST",
            body: formdata,
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.status != 404) {
                const itemCount = basket.filter(
                  (item) => item.barcode === barcode
                ).length;
                if (itemCount > 0) {
                  const index = basket.findIndex(
                    (item) => item.barcode === barcode
                  );
                  if (count > 1) {
                    basket[index].count = basket[index].count + parseInt(count);
                    setTotal(
                      (prev) =>
                        prev + parseInt(basket[index].price) * parseInt(count)
                    );
                  } else {
                    basket[index].count += 1;
                    setTotal((prev) => prev + parseInt(basket[index].price));
                  }
                  setBasket([...basket]); // Sadece 1. sepet için
                } else {
                  const p = parseInt(data.price);
                  setBasket([
                    ...basket,
                    {
                      image: data.data.image,
                      name: data.data.name,
                      cost: data.data.cost,
                      barcode,
                      count: count,
                      price: parseInt(data.data.price),
                      store: data.data.store,
                      category: data.data.category,
                    },
                  ]);
                  setTotal(total + p);
                }
                setOpen(false);
                setBarcode("");
              } else {
                handleProductNotFound();
              }
            });
        }
        break;

      case 1:
        if (e.key === "Enter") {
          const formdata = new FormData();
          formdata.append("action", "findByBarcode");
          formdata.append("barcode", barcode);
          fetch(process.env.REACT_APP_BASE_URL + "product.php", {
            method: "POST",
            body: formdata,
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.status != 404) {
                const itemCount = b2.filter(
                  (item) => item.barcode === barcode
                ).length;
                if (itemCount > 0) {
                  const index = b2.findIndex(
                    (item) => item.barcode === barcode
                  );
                  if (count > 1) {
                    b2[index].count = b2[index].count + parseInt(count);
                    setTotal(
                      (prev) =>
                        prev + parseInt(b2[index].price) * parseInt(count)
                    );
                  } else {
                    b2[index].count += 1;
                    setTotal((prev) => prev + parseInt(b2[index].price));
                  }
                  setB2([...b2]); // 2. sepet için
                } else {
                  const p = parseInt(data.price);
                  setB2([
                    ...b2,
                    {
                      image: data.data.image,
                      name: data.data.name,
                      cost: data.data.cost,
                      barcode,
                      count: count,
                      price: parseInt(data.data.price),
                      store: data.data.store,
                      category: data.data.category,
                    },
                  ]);
                  setTotal(total + p);
                }
                setOpen(false);
                setBarcode("");
              } else {
                handleProductNotFound();
              }
            });
        }
        break;

      case 2:
        if (e.key === "Enter") {
          const formdata = new FormData();
          formdata.append("action", "findByBarcode");
          formdata.append("barcode", barcode);
          fetch(process.env.REACT_APP_BASE_URL + "product.php", {
            method: "POST",
            body: formdata,
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.status != 404) {
                const itemCount = b3.filter(
                  (item) => item.barcode === barcode
                ).length;
                if (itemCount > 0) {
                  const index = b3.findIndex(
                    (item) => item.barcode === barcode
                  );
                  if (count > 1) {
                    b3[index].count = b3[index].count + parseInt(count);
                    setTotal(
                      (prev) =>
                        prev + parseInt(b3[index].price) * parseInt(count)
                    );
                  } else {
                    b3[index].count += 1;
                    setTotal((prev) => prev + parseInt(b3[index].price));
                  }
                  setB3([...b3]); // 3. sepet için
                } else {
                  const p = parseInt(data.price);
                  setB3([
                    ...b3,
                    {
                      image: data.data.image,
                      name: data.data.name,
                      cost: data.data.cost,
                      barcode,
                      count: count,
                      price: parseInt(data.data.price),
                      store: data.data.store,
                      category: data.data.category,
                    },
                  ]);
                  setTotal(total + p);
                }
                setOpen(false);
                setBarcode("");
              } else {
                handleProductNotFound();
              }
            });
        }
        break;

      case 3:
        if (e.key === "Enter") {
          const formdata = new FormData();
          formdata.append("action", "findByBarcode");
          formdata.append("barcode", barcode);
          fetch(process.env.REACT_APP_BASE_URL + "product.php", {
            method: "POST",
            body: formdata,
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.status != 404) {
                const itemCount = b4.filter(
                  (item) => item.barcode === barcode
                ).length;
                if (itemCount > 0) {
                  const index = b4.findIndex(
                    (item) => item.barcode === barcode
                  );
                  if (count > 1) {
                    b4[index].count = b4[index].count + parseInt(count);
                    setTotal(
                      (prev) =>
                        prev + parseInt(b4[index].price) * parseInt(count)
                    );
                  } else {
                    b4[index].count += 1;
                    setTotal((prev) => prev + parseInt(b4[index].price));
                  }
                  setB4([...b4]); // 4. sepet için
                } else {
                  const p = parseInt(data.price);
                  setB4([
                    ...b4,
                    {
                      image: data.data.image,
                      name: data.data.name,
                      cost: data.data.cost,
                      barcode,
                      count: count,
                      price: parseInt(data.data.price),
                      store: data.data.store,
                      category: data.data.category,
                    },
                  ]);
                  setTotal(total + p);
                }
                setOpen(false);
                setBarcode("");
              } else {
                handleProductNotFound();
              }
            });
        }
        break;
    }
  };

  const clearBasket = (func) => {
    func([]);
    setBarcode("");
  };

  useEffect(() => {
    switch (selectedBasket) {
      case 0:
        if (modal) {
          if (discount > totalHandel()) {
            toast.error("İndirim sepet tutarından fazla olamaz");
            sellBtn.current.classList.add("hidden");
          } else {
            sellBtn.current.classList.remove("hidden");
          }
        }
        break;

      case 1:
        if (modal) {
          if (discount2 > totalHandel()) {
            toast.error("İndirim sepet tutarından fazla olamaz");
            sellBtn.current.classList.add("hidden");
          } else {
            sellBtn.current.classList.remove("hidden");
          }
        }
        break;

      case 2:
        if (modal) {
          if (discount3 > totalHandel()) {
            toast.error("İndirim sepet tutarından fazla olamaz");
            sellBtn.current.classList.add("hidden");
          } else {
            sellBtn.current.classList.remove("hidden");
          }
        }
        break;

      case 3:
        if (modal) {
          if (discount4 > totalHandel()) {
            toast.error("İndirim sepet tutarından fazla olamaz");
            sellBtn.current.classList.add("hidden");
          } else {
            sellBtn.current.classList.remove("hidden");
          }
        }
        break;
    }
  }, [discount, discount2, discount3, discount4]);

  useEffect(() => {
    setCount(1);
    switch (selectedBasket) {
      case 0:
        window.localStorage.setItem("basket", JSON.stringify(basket));
        break;
      case 1:
        window.localStorage.setItem("basket2", JSON.stringify(b2));
        break;
      case 2:
        window.localStorage.setItem("basket3", JSON.stringify(b3));
        break;
      case 3:
        window.localStorage.setItem("basket4", JSON.stringify(b4));
        break;
    }
  }, [basket, b2, b3, b4]);

  const options = {
    formats: [
      "ean_13",
      "code_128",
      "code_39",
      "code_93",
      "codabar",
      "ean_8",
      "itf",
      "qr_code",
      "upc_a",
      "upc_e",
    ],
  };

  const basketSet = (item) => {
    console.log(item);

    switch (selectedBasket) {
      case 0:
        const formdata = new FormData();
        formdata.append("action", "findByBarcode");
        formdata.append("barcode", item.barcode);
        fetch(process.env.REACT_APP_BASE_URL + "product.php", {
          method: "POST",
          body: formdata,
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.status != 404) {
              const itemCount = basket.filter(
                (item) => item.barcode === barcode
              ).length;
              if (itemCount > 0) {
                const index = basket.findIndex(
                  (item) => item.barcode === barcode
                );
                if (count > 1) {
                  basket[index].count = basket[index].count + parseInt(count);
                  setTotal(
                    (prev) =>
                      prev + parseInt(basket[index].price) * parseInt(count)
                  );
                } else {
                  basket[index].count += 1;
                  setTotal((prev) => prev + parseInt(basket[index].price));
                }
                setBasket([...basket]); // 3. sepet için
              } else {
                const p = parseInt(data.price);
                setBasket([
                  ...basket,
                  {
                    image: data.data.image,
                    name: data.data.name,
                    cost: data.data.cost,
                    barcode,
                    count: count,
                    price: parseInt(data.data.price),
                    store: data.data.store,
                    category: data.data.category,
                  },
                ]);
                setTotal(total + p);
              }
              setOpen(false);
              setBarcode("");
            } else {
              handleProductNotFound();
            }
          });

        break;
    }
  };

  useEffect(() => {
    const formdata = new FormData();
    formdata.append("action", "list");
    fetch(process.env.REACT_APP_BASE_URL + "product.php", {
      method: "POST",
      body: formdata,
    })
      .then((res) => res.json())
      .then((data) => {
        setList(data);
      });
  }, []);


  if(loading){
    return(
      <div className="flex flex-col items-center gap-2 fixed top-0 left-0 right-0 bottom-0 justify-center h-screen">
        <AiOutlineLoading3Quarters className="text-2xl md:text-4xl lg:text-6xl animate-spin"></AiOutlineLoading3Quarters>
        <p className="text-sm text-gray-500">İşlem gerçekleştiriliyor...</p>
      </div>
    )
  }

  return (
    <Container>
        <Toaster position="top-right" />

        {
          open && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
                <BarcodeScanner onCapture={onCapture} options={options} />
                <div className="flex items-center gap-2 mt-4">
                  {isSupportTorch && (
                    <button
                      onClick={onTorchSwitch}
                      className="px-4 py-2 bg-yellow-400 text-black rounded-lg"
                    >
                      El Feneri
                    </button>
                  )}
                  <button
                    onClick={() => setOpen(false)}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg"
                  >
                    Kapat
                  </button>
                </div>
              </div>
            </div>
          )
        }
      <div className="w-full mx-auto space-y-4 px-4">
        {/* Üst Kontrol Paneli */}
        <div className="bg-white backdrop-blur-lg rounded-xl shadow-lg p-4 border border-gray-100">
          {/* Başlık ve Durum */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-3">
            <div>
              <h1 className="text-lg font-semibold text-gray-800">
                Satış İşlemi
              </h1>
              <p className="text-sm text-gray-500">
                Barkod okutarak veya manuel giriş yaparak satış yapabilirsiniz
              </p>
            </div>
            <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-lg">
              <FaBasketShopping className="text-indigo-600 text-sm" />
              <span className="text-sm text-indigo-600 font-medium">
                Sepet {selectedBasket + 1}
              </span>
            </div>
          </div>

          {/* Barkod ve Kontroller */}
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="md:col-span-6 relative">
                <input
                  type="text"
                  ref={barcodeText}
                  onKeyDown={keyHandel}
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  placeholder="Barkod giriniz"
                  className="w-full pl-3 pr-10 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <FaBarcode size={16} />
                </div>
              </div>
              <div className="md:col-span-2">
                <input
                  type="number"
                  value={count}
                  onChange={(e) => setCount(e.target.value)}
                  placeholder="Adet"
                  className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
              </div>
              <div className="md:col-span-4 flex gap-2">
                <button
                  onClick={() => setOpen(true)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-lg transition-all"
                >
                  <FaCamera size={14} />
                  <span>Kamera ile Oku</span>
                </button>
                {selectedBasket === 0 && basket.length > 0 && (
                  <button
                    onClick={() => clearBasket(setBasket)}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all"
                  >
                    <FaTrash size={14} />
                  </button>
                )}
                {selectedBasket === 1 && b2.length > 0 && (
                  <button
                    onClick={() => clearBasket(setB2)}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all"
                  >
                    <FaTrash size={14} />
                  </button>
                )}
                {selectedBasket === 2 && b3.length > 0 && (
                  <button
                    onClick={() => clearBasket(setB3)}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all"
                  >
                    <FaTrash size={14} />
                  </button>
                )}
                {selectedBasket === 3 && b4.length > 0 && (
                  <button
                    onClick={() => clearBasket(setB4)}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all"
                  >
                    <FaTrash size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Hızlı Ürün Seçimi */}
            <div className="relative">
              <select
                onChange={(e) => setBarcode(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none transition-all"
              >
                <option value="">Hızlı ürün seçiniz</option>
                {list?.map((item) => (
                  <option key={item.id} value={item.barcode}>
                    {item.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <FaChevronDown size={12} />
              </div>
            </div>

            {/* Sepet Seçimi */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[0, 1, 2, 3].map((basketId) => (
                <button
                  key={basketId}
                  onClick={() => basketHandel(basketId)}
                  className={`relative group p-3 rounded-lg transition-all ${
                    selectedBasket === basketId
                      ? "bg-indigo-600 text-white ring-2 ring-indigo-600 ring-offset-2"
                      : "bg-white hover:bg-gray-50 text-gray-600 border border-gray-200"
                  }`}
                >
                  <div className="flex flex-col items-center gap-1.5">
                    <FaBasketShopping
                      size={16}
                      className={
                        selectedBasket === basketId
                          ? "text-white"
                          : "text-gray-400 group-hover:text-indigo-600"
                      }
                    />
                    <span className="text-sm font-medium">
                      Sepet {basketId + 1}
                    </span>
                    {((basketId === 0 && basket.length > 0) ||
                      (basketId === 1 && b2.length > 0) ||
                      (basketId === 2 && b3.length > 0) ||
                      (basketId === 3 && b4.length > 0)) && (
                      <div className="absolute -top-1.5 -right-1.5 w-5 h-5 flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full">
                        {basketId === 0
                          ? basket.length
                          : basketId === 1
                          ? b2.length
                          : basketId === 2
                          ? b3.length
                          : b4.length}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Ürün Kartları */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-24">
          {selectedBasket === 0 &&
            basket.map((item) => (
              <SalesCard
                key={item.barcode}
                item={item}
                func={setBasket}
                value={basket}
              />
            ))}
          {selectedBasket === 1 &&
            b2.map((item) => (
              <SalesCard
                key={item.barcode}
                item={item}
                func={setB2}
                value={b2}
              />
            ))}
          {selectedBasket === 2 &&
            b3.map((item) => (
              <SalesCard
                key={item.barcode}
                item={item}
                func={setB3}
                value={b3}
              />
            ))}
          {selectedBasket === 3 &&
            b4.map((item) => (
              <SalesCard
                key={item.barcode}
                item={item}
                func={setB4}
                value={b4}
              />
            ))}
        </div>

        {/* Alt Toplam Çubuğu - Tüm sepetler için */}
        {((selectedBasket === 0 && basket.length > 0) ||
          (selectedBasket === 1 && b2.length > 0) ||
          (selectedBasket === 2 && b3.length > 0) ||
          (selectedBasket === 3 && b4.length > 0)) && (
          <div className="fixed bottom-4 left-4 right-4">
            <div className="max-w-7xl mx-auto">
              <div className="bg-white backdrop-blur-lg rounded-xl shadow-lg p-4 border border-gray-100">
                <div className="flex flex-col md:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <FaBasketShopping className="text-gray-400 text-sm" />
                      <span className="text-sm text-gray-600">
                        Toplam Ürün:{" "}
                        <span className="font-medium">
                          {selectedBasket === 0
                            ? basket.length
                            : selectedBasket === 1
                            ? b2.length
                            : selectedBasket === 2
                            ? b3.length
                            : b4.length}
                        </span>
                      </span>
                    </div>
                    <div className="text-base font-bold text-gray-800">
                      Toplam:{" "}
                      <span className="text-indigo-600">
                        {totalHandel()} TL
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={sellHandel}
                    className="w-full md:w-auto px-6 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-all flex items-center justify-center gap-2"
                  >
                    <FaCheck size={14} />
                    <span>Satışı Tamamla</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal - Tüm sepetler için */}
        {modal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  Satış Onayı - Sepet {selectedBasket + 1}
                </h2>
                <button 
                  onClick={() => setModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Toplam Tutar:</span>
                  <span className="text-lg font-bold text-gray-800">{totalHandel()} TL</span>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm text-gray-600">İndirim Tipi</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        switch (selectedBasket) {
                          case 0:
                            setType(false);
                            break;
                          case 1:
                            setType2(false);
                            break;
                          case 2:
                            setType3(false);
                            break;
                          case 3:
                            setType4(false);
                            break;
                        }
                      }}
                      className={`flex-1 py-2 px-4 text-sm rounded-lg transition-all ${
                        (selectedBasket === 0 && !type) ||
                        (selectedBasket === 1 && !type2) ||
                        (selectedBasket === 2 && !type3) ||
                        (selectedBasket === 3 && !type4)
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      Tutar
                    </button>
                    <button
                      onClick={() => {
                        switch (selectedBasket) {
                          case 0:
                            setType(true);
                            break;
                          case 1:
                            setType2(true);
                            break;
                          case 2:
                            setType3(true);
                            break;
                          case 3:
                            setType4(true);
                            break;
                        }
                      }}
                      className={`flex-1 py-2 px-4 text-sm rounded-lg transition-all ${
                        (selectedBasket === 0 && type) ||
                        (selectedBasket === 1 && type2) ||
                        (selectedBasket === 2 && type3) ||
                        (selectedBasket === 3 && type4)
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      Yüzde
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    {(selectedBasket === 0 && type) ||
                     (selectedBasket === 1 && type2) ||
                     (selectedBasket === 2 && type3) ||
                     (selectedBasket === 3 && type4)
                      ? 'İndirim Yüzdesi'
                      : 'İndirim Tutarı'}
                  </label>
                  <input
                    type="number"
                    value={
                      selectedBasket === 0
                        ? type ? per : discount
                        : selectedBasket === 1
                        ? type2 ? per2 : discount2
                        : selectedBasket === 2
                        ? type3 ? per3 : discount3
                        : type4 ? per4 : discount4
                    }
                    onChange={(e) => {
                      switch (selectedBasket) {
                        case 0:
                          type ? setPer(e.target.value) : setDiscount(e.target.value);
                          break;
                        case 1:
                          type2 ? setPer2(e.target.value) : setDiscount2(e.target.value);
                          break;
                        case 2:
                          type3 ? setPer3(e.target.value) : setDiscount3(e.target.value);
                          break;
                        case 3:
                          type4 ? setPer4(e.target.value) : setDiscount4(e.target.value);
                          break;
                      }
                    }}
                    className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder={type ? 'Yüzde giriniz' : 'Tutar giriniz'}
                  />
                </div>

                <div className="flex justify-between items-center font-bold">
                  <span className="text-gray-800">İndirimli Toplam:</span>
                  <span className="text-indigo-600">{totalHandel()} TL</span>
                </div>

                <button
                  ref={sellBtn}
                  onClick={fetchHandel}
                  disabled={loading}
                  className="w-full py-3 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                  ) : (
                    <>
                      <FaCheck size={14} />
                      <span>Satışı Onayla</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
};

export default Sales;
