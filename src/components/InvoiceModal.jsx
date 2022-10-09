import React, { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";
import Spinner from "react-bootstrap/Spinner";

import pdfMake from "pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import htmlToPdfmake from "html-to-pdfmake";

const InvoiceModal = ({
  isOpen,
  setIsOpen,
  invoiceInfo,
  items,
  onAddNextInvoice,
  email,
}) => {
  function closeModal() {
    setIsOpen(false);
  }

  const addNextInvoiceHandler = () => {
    setIsOpen(false);
    onAddNextInvoice();
  };

  const [loadingdisable, setlaodingdisable] = useState(false);

  const SaveAsPDFHandler = () => {
    const dom = document.getElementById("print");
    toPng(dom)
      .then((dataUrl) => {
        const img = new Image();
        img.crossOrigin = "annoymous";
        img.src = dataUrl;
        img.onload = () => {
          // Initialize the PDF.
          const pdf = new jsPDF({
            orientation: "portrait",
            unit: "in",
            format: [5.5, 8.5],
          });

          // Define reused data
          const imgProps = pdf.getImageProperties(img);
          const imageType = imgProps.fileType;
          const pdfWidth = pdf.internal.pageSize.getWidth();

          // Calculate the number of pages.
          const pxFullHeight = imgProps.height;
          const pxPageHeight = Math.floor((imgProps.width * 8.5) / 5.5);
          const nPages = Math.ceil(pxFullHeight / pxPageHeight);

          // Define pageHeight separately so it can be trimmed on the final page.
          let pageHeight = pdf.internal.pageSize.getHeight();

          // Create a one-page canvas to split up the full image.
          const pageCanvas = document.createElement("canvas");
          const pageCtx = pageCanvas.getContext("2d");
          pageCanvas.width = imgProps.width;
          pageCanvas.height = pxPageHeight;

          for (let page = 0; page < nPages; page++) {
            // Trim the final page to reduce file size.
            if (page === nPages - 1 && pxFullHeight % pxPageHeight !== 0) {
              pageCanvas.height = pxFullHeight % pxPageHeight;
              pageHeight = (pageCanvas.height * pdfWidth) / pageCanvas.width;
            }
            // Display the page.
            const w = pageCanvas.width;
            const h = pageCanvas.height;
            pageCtx.fillStyle = "white";
            pageCtx.fillRect(0, 0, w, h);
            pageCtx.drawImage(img, 0, page * pxPageHeight, w, h, 0, 0, w, h);

            // Add the page to the PDF.
            if (page) pdf.addPage();

            const imgData = pageCanvas.toDataURL(`image/${imageType}`, 1);
            pdf.addImage(imgData, imageType, 0, 0, pdfWidth, pageHeight);
          }
          // Output / Save
          pdf.save(`invoice-${invoiceInfo.invoiceNumber}.pdf`);
          setdisabledownload(true);
          window.alert("Choose Invoice Upload");
        };
      })
      .catch((error) => {
        console.error("oops, something went wrong!", error);
      });
  };

  const [disabledownload, setdisabledownload] = useState(false);

  // const SaveAsPDFHandler = () => {
  //   setdisabledownload(true);
  // };
  const [disablfileinput, setdisablfileinput] = useState(false);
  const [file, setfile] = useState(null);
  const uploadFile = (e) => {
    setfile(e);
  };
  const [disablenext, setdisablenext] = useState(false);

  const postPdf = () => {
    setdisablfileinput(true);
    setlaodingdisable(true);
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "notezipper");
    data.append("cloud_name", "dykmiet9x");
    fetch("https://api.cloudinary.com/v1_1/dykmiet9x/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        // setPic(data.url.toString());
        console.log(data.url.toString());
        setdisablenext(true);
        setlaodingdisable(false);
        window.alert("Invoice Uploaded");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    if (file) {
      if (file.type == "application/pdf") {
        postPdf(file);
      }
    }
  }, [file]);
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={closeModal}
      >
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div
              style={{ width: "50vw" }}
              className="my-8 inline-block w-full   transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all"
            >
              <div className="p-4" id="print">
                <h1 className="text-center text-lg font-bold text-gray-900">
                  INVOICE
                </h1>
                <div className="mt-6">
                  <div className="mb-4 grid grid-cols-2">
                    <span className="font-bold">Invoice Number:</span>
                    <span>{invoiceInfo.invoiceNumber}</span>
                    <span className="font-bold">Cashier:</span>
                    <span>{invoiceInfo.cashierName}</span>
                    <span className="font-bold">Customer:</span>
                    <span>{invoiceInfo.customerName}</span>
                    <span className="font-bold">Customer Email:</span>
                    <span>{email}</span>
                  </div>

                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-y border-black/10 text-sm md:text-base">
                        <th>ITEM</th>
                        <th className="text-center">QTY</th>
                        <th className="text-right">PRICE</th>
                        <th className="text-right">AMOUNT</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item) => (
                        <tr key={item.id}>
                          <td className="w-full">{item.name}</td>
                          <td className="min-w-[50px] text-center">
                            {item.qty}
                          </td>
                          <td className="min-w-[80px] text-right">
                            ₹{Number(item.price).toFixed(2)}
                          </td>
                          <td className="min-w-[90px] text-right">
                            ₹{Number(item.price * item.qty).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="mt-4 flex flex-col items-end space-y-2">
                    <div className="flex w-full justify-between border-t border-black/10 pt-2">
                      <span className="font-bold">Subtotal:</span>
                      <span>₹{invoiceInfo.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex w-full justify-between">
                      <span className="font-bold">Discount:</span>
                      <span>₹{invoiceInfo.discountRate.toFixed(2)}</span>
                    </div>
                    <div className="flex w-full justify-between">
                      <span className="font-bold">Tax:</span>
                      <span>₹{invoiceInfo.taxRate.toFixed(2)}</span>
                    </div>
                    <div className="flex w-full justify-between border-t border-black/10 py-2">
                      <span className="font-bold">Total:</span>
                      <span className="font-bold">
                        ₹
                        {invoiceInfo.total % 1 === 0
                          ? invoiceInfo.total
                          : invoiceInfo.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex space-x-2 px-4 pb-6">
                {!disablfileinput && disabledownload && (
                  <div
                    className="input-group"
                    style={{ width: "200px", marginLeft: "  16vw" }}
                  >
                    <div className="custom-file" style={{ width: "100px" }}>
                      <input
                        onChange={(e) => uploadFile(e.target.files[0])}
                        type="file"
                        className="custom-file-input"
                        id="inputGroupFile01"
                        style={{
                          border: "none",
                          borderRadius: "5px",
                          color: "white",
                          background: "#437eff",
                        }}
                        aria-describedby="inputGroupFileAddon01"
                      />
                    </div>
                  </div>
                )}

                {!disabledownload && (
                  <button
                    className="flex w-full items-center justify-center space-x-1 rounded-md border border-blue-500 py-2 text-sm text-blue-500 shadow-sm hover:bg-blue-500 hover:text-white"
                    onClick={SaveAsPDFHandler}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    <span>Download</span>
                  </button>
                )}
                {loadingdisable && (
                  <div
                    style={{
                      width: "100%",
                      background: "#437eff",
                      display: "grid",
                      placeItems: "center",
                      borderRadius: "5px",
                      height: "4vh",
                      color: "white",
                    }}
                  >
                    <Spinner animation="border" role="status">
                      <span className="visually-hidden">
                        Loading Please Wait...
                      </span>
                    </Spinner>
                  </div>
                )}
                {disablenext && (
                  <button
                    onClick={addNextInvoiceHandler}
                    className="flex w-full items-center justify-center space-x-1 rounded-md bg-blue-500 py-2 text-sm text-white shadow-sm hover:bg-blue-600"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 5l7 7-7 7M5 5l7 7-7 7"
                      />
                    </svg>
                    <span>Send Email</span>
                  </button>
                )}
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default InvoiceModal;

// import React, { Fragment } from "react";
// import { Dialog, Transition } from "@headlessui/react";
// import { toPng } from "html-to-image";
// import { jsPDF } from "jspdf";
// import ForwardToInboxIcon from "@mui/icons-material/ForwardToInbox";
// import { useState } from "react";
// import { useEffect } from "react";

// import pdfMake from "pdfmake";
// import pdfFonts from "pdfmake/build/vfs_fonts";
// import htmlToPdfmake from "html-to-pdfmake";
// import OutlinedInput from "@mui/material/OutlinedInput";
// import styled from "styled-components";
// import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";

// import Form from "react-bootstrap/Form";
// import emailjs from "emailjs-com";

// const Button = styled.button;

// const InvoiceModal = ({
//   isOpen,
//   setIsOpen,
//   invoiceInfo,
//   items,
//   onAddNextInvoice,
//   email,
// }) => {
//   function closeModal() {
//     setIsOpen(false);
//   }
//   const [file, setfile] = useState(null);
//   const uploadFile = (e) => {
//     console.log(e);
//     setfile(e);
//   };

//   const sendData = (pdf) => {
//     const data = new FormData();
//     data.append("file", pdf);
//     data.append("upload_preset", "notezipper");
//     data.append("cloud_name", "dykmiet9x");
//     fetch("https://api.cloudinary.com/v1_1/dykmiet9x/image/upload", {
//       method: "post",
//       body: data,
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         console.log(data);
//         // setPic(data.url.toString());
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   };

//   const [link, setLink] = useState();
//   const [name, setName] = useState(invoiceInfo.cashierName);

//   const upload = (e) => {
//     if (file) {
//       const data = new FormData();
//       data.append("file", file);
//       data.append("upload_preset", "notezipper");
//       data.append("cloud_name", "dykmiet9x");
//       fetch("https://api.cloudinary.com/v1_1/dykmiet9x/image/upload", {
//         method: "post",
//         body: data,
//       })
//         .then((res) => res.json())
//         .then((data) => {
//           console.log(data);
//           console.log(data.url.toString());
//           setLink(data.url.toString());
//           sendEmail(e);
//           setIsOpen(false);
//           onAddNextInvoice();
//         })
//         .catch((err) => {
//           console.log(err);
//         });
//     }
//   };
//   const [sendval, setsendval] = useState(null);
//   useEffect(() => {
//     if (link && name) {
//       const send = `<form class="contact-form">
//         <input value="${name}" type="hidden" name="contact_number"></input>
//         <label>Name</label>
//         <input value="abincsyit@gmail.com" type="text" name="to_name"></input>
//         <label>Email</label>
//         <input value="${link}" type="email" name="from_email"></input>
//         <label>Message</label>
//         <textarea name="message"></textarea>
//         <input type="submit" value="Send"></input>
//         </form>`;
//       setsendval(send);
//     }
//   }, [link, name]);

//   function sendEmail(e) {
//     e.preventDefault();

//     if (sendval) {
//       emailjs
//         .sendForm(
//           "service_axh3gj4",
//           "template_itff39lD",
//           sendval,
//           "Zcoe5AMgn6Hc10_wP"
//         )
//         .then(
//           (result) => {
//             window.location.reload();
//           },
//           (error) => {
//             console.log(error.text);
//           }
//         );
//     }
//   }

//   const sendPdf = () => {
//     const dom = document.getElementById("print");
//     toPng(dom)
//       .then((dataUrl) => {
//         const img = new Image();
//         img.crossOrigin = "annoymous";
//         img.src = dataUrl;
//         img.onload = () => {
//           const pdf = new jsPDF({
//             orientation: "portrait",
//             unit: "in",
//             format: [5.5, 8.5],
//           });
//           const imgProps = pdf.getImageProperties(img);
//           const imageType = imgProps.fileType;
//           const pdfWidth = pdf.internal.pageSize.getWidth();
//           const pxFullHeight = imgProps.height;
//           const pxPageHeight = Math.floor((imgProps.width * 8.5) / 5.5);
//           const nPages = Math.ceil(pxFullHeight / pxPageHeight);
//           let pageHeight = pdf.internal.pageSize.getHeight();
//           const pageCanvas = document.createElement("canvas");
//           const pageCtx = pageCanvas.getContext("2d");
//           pageCanvas.width = imgProps.width;
//           pageCanvas.height = pxPageHeight;
//           for (let page = 0; page < nPages; page++) {
//             if (page === nPages - 1 && pxFullHeight % pxPageHeight !== 0) {
//               pageCanvas.height = pxFullHeight % pxPageHeight;
//               pageHeight = (pageCanvas.height * pdfWidth) / pageCanvas.width;
//             }
//             const w = pageCanvas.width;
//             const h = pageCanvas.height;
//             pageCtx.fillStyle = "white";
//             pageCtx.fillRect(0, 0, w, h);
//             pageCtx.drawImage(img, 0, page * pxPageHeight, w, h, 0, 0, w, h);
//             if (page) pdf.addPage();
//             const imgData = pageCanvas.toDataURL(`image/${imageType}`, 1);
//             pdf.addImage(imgData, imageType, 0, 0, pdfWidth, pageHeight);
//           }
//           pdf.save(`invoice-${invoiceInfo.invoiceNumber}.pdf`);
//         };
//       })
//       .catch((error) => {
//         console.error("oops, something went wrong!", error);
//       });
//   };

//   return (
//     <Transition appear show={isOpen} as={Fragment}>
//       <Dialog
//         as="div"
//         className="fixed inset-0 z-10 overflow-y-auto"
//         onClose={closeModal}
//       >
//         <div className="min-h-screen px-4 text-center">
//           <Transition.Child
//             as={Fragment}
//             enter="ease-out duration-300"
//             enterFrom="opacity-0"
//             enterTo="opacity-100"
//             leave="ease-in duration-200"
//             leaveFrom="opacity-100"
//             leaveTo="opacity-0"
//           >
//             <Dialog.Overlay className="fixed inset-0 bg-black/50" />
//           </Transition.Child>

//           <span
//             className="inline-block h-screen align-middle"
//             aria-hidden="true"
//           >
//             &#8203;
//           </span>
//           <Transition.Child
//             as={Fragment}
//             enter="ease-out duration-300"
//             enterFrom="opacity-0 scale-95"
//             enterTo="opacity-100 scale-100"
//             leave="ease-in duration-200"
//             leaveFrom="opacity-100 scale-100"
//             leaveTo="opacity-0 scale-95"
//           >
//             <div
//               style={{ width: "50vw" }}
//               className="my-8 inline-block w-full  transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all"
//             >
//               <div className="p-4" id="print">
//                 <h1 className="text-center text-lg font-bold text-gray-900">
//                   INVOICE
//                 </h1>
//                 <div className="mt-6">
//                   <div className="mb-4 grid grid-cols-2">
//                     <span className="font-bold">Invoice Number:</span>
//                     <span>{invoiceInfo.invoiceNumber}</span>
//                     <span className="font-bold">Cashier:</span>
//                     <span>{invoiceInfo.cashierName}</span>
//                     <span className="font-bold">Customer:</span>
//                     <span>{invoiceInfo.customerName}</span>
//                     <span className="font-bold">Customer Email:</span>
//                     <span>{email}</span>
//                   </div>

//                   <table className="w-full text-left">
//                     <thead>
//                       <tr className="border-y border-black/10 text-sm md:text-base">
//                         <th>ITEM</th>
//                         <th className="text-center">QTY</th>
//                         <th className="text-right">PRICE</th>
//                         <th className="text-right">AMOUNT</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {items.map((item) => (
//                         <tr key={item.id}>
//                           <td className="w-full">{item.name}</td>
//                           <td className="min-w-[50px] text-center">
//                             {item.qty}
//                           </td>
//                           <td className="min-w-[80px] text-right">
//                             ₹{Number(item.price).toFixed(2)}
//                           </td>
//                           <td className="min-w-[90px] text-right">
//                             ₹{Number(item.price * item.qty).toFixed(2)}
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>

//                   <div className="mt-4 flex flex-col items-end space-y-2">
//                     <div className="flex w-full justify-between border-t border-black/10 pt-2">
//                       <span className="font-bold">Subtotal:</span>
//                       <span>₹{invoiceInfo.subtotal.toFixed(2)}</span>
//                     </div>
//                     <div className="flex w-full justify-between">
//                       <span className="font-bold">Discount:</span>
//                       <span>₹{invoiceInfo.discountRate.toFixed(2)}</span>
//                     </div>
//                     <div className="flex w-full justify-between">
//                       <span className="font-bold">Tax:</span>
//                       <span>₹{invoiceInfo.taxRate.toFixed(2)}</span>
//                     </div>
//                     <div className="flex w-full justify-between border-t border-black/10 py-2">
//                       <span className="font-bold">Total:</span>
//                       <span className="font-bold">
//                         {invoiceInfo.total % 1 === 0
//                           ? invoiceInfo.total
//                           : invoiceInfo.total.toFixed(2)}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div>
//                 <div
//                   className="input-group"
//                   style={{ width: "200px", marginLeft: "  16vw" }}
//                 >
//                   <div className="custom-file" style={{ width: "100px" }}>
//                     <input
//                       onChange={(e) => uploadFile(e.target.files[0])}
//                       type="file"
//                       className="custom-file-input"
//                       id="inputGroupFile01"
//                       style={{ border: "2px solid black", borderRadius: "5px" }}
//                       aria-describedby="inputGroupFileAddon01"
//                     />
//                   </div>
//                 </div>
//                 <div></div>
//               </div>
//               <div className="mt-4 flex space-x-2 px-4 pb-6">
//                 <button
//                   className="flex w-full items-center justify-center space-x-1 rounded-md border border-blue-500 py-2 text-sm text-blue-500 shadow-sm hover:bg-blue-500 hover:text-white"
//                   onClick={sendPdf}
//                 >
//                   <DriveFolderUploadIcon />
//                   <span>Add Bill</span>
//                 </button>

//                 <button
//                   className="flex w-full items-center justify-center space-x-1 rounded-md bg-blue-500 py-2 text-sm text-white shadow-sm hover:bg-blue-600"
//                   onClick={upload}
//                 >
//                   <ForwardToInboxIcon />
//                   <span>SendEmail</span>
//                 </button>
//               </div>
//             </div>
//           </Transition.Child>
//         </div>
//       </Dialog>
//     </Transition>
//   );
// };

// export default InvoiceModal;
