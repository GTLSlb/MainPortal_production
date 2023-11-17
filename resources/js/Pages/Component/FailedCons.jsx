import { useLayoutEffect, useRef, useState } from "react";
import ReactPaginate from "react-paginate";
import { useDownloadExcel, downloadExcel } from "react-export-table-to-excel";
import { useEffect } from "react";
import * as XLSX from "xlsx";
import notFound from "../../assets/pictures/NotFound.png";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import { PencilIcon } from "@heroicons/react/24/outline";
import moment from "moment";
import {
    ChevronDownIcon,
    PhoneIcon,
    PlayCircleIcon,
} from "@heroicons/react/20/solid";
import {
    ArrowPathIcon,
    ChartPieIcon,
    CursorArrowRaysIcon,
    FingerPrintIcon,
    SquaresPlusIcon,
} from "@heroicons/react/24/outline";
import SetFailedReasonModal from "@/Components/SetFailedReasonModal";

const people = [
    {
        ConsignmentId: 275576,
        ConsignmentNo: "FOR100312",
        SenderName: "INDUSTRIAL STEEL",
        ReceiverName: "R AND A CONCRETING",
        FromState: "QLD",
        ToState: "VIC",
        POD: true,
        MatchTransit: false,
        MatchRdd: false,
    },
    // More people...
];

const Roles = ["1", "3", "4", "5"];

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function FailedCons({
    PerfData,
    failedReasons,
    url,
    setActiveIndexGTRS,
    setLastIndex,
    setactiveCon,
    currentUser,
    accData,
    EDate,
    setEDate,
    SDate,
    setSDate,
    oldestDate,
    latestDate,
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [reason, setReason] = useState();
    const handleEditClick = (reason) => {
        setReason(reason);
        setIsModalOpen(!isModalOpen);
    };
    // const data = PerfData.filter((obj) => obj.STATUS === "FAIL");
    const handleClick = (coindex) => {
        setActiveIndexGTRS(3);
        setLastIndex(5);
        setactiveCon(coindex);
    };

    const [data, setData] = useState(
        PerfData?.filter((obj) => obj.STATUS === "FAIL")
    );
    const [filteredData, setFilteredData] = useState(data);
    const [selectedConsignment, setSelectedConsignment] = useState("");

    const handleStartDateChange = (event) => {
        const value = event.target.value;
        setSDate(value);
        filterData(value, EDate, selectedConsignment);
    };
    const handleEndDateChange = (event) => {
        const value = event.target.value;
        setEDate(value);
        // filterData(SDate, value);
        filterData(SDate, value, selectedConsignment);
    };
    const handleConsignmentChange = (value) => {
        setSelectedConsignment(value);
        filterData(SDate, EDate, value);
    };
    const filterData = (startDate, endDate, selectedConsignment) => {
        const intArray = accData?.map((str) => {
            const intValue = parseInt(str);
            return isNaN(intValue) ? 0 : intValue;
        });
        // Filter the data based on the start and end date filters
        const filtered = data?.filter((item) => {
            const chargeToMatch =
                intArray?.length === 0 || intArray?.includes(item.ChargeTo);
            const itemDate = new Date(item.DESPATCHDATE); // Convert item's date string to Date object
            const filterStartDate = new Date(startDate); // Convert start date string to Date object
            const filterEndDate = new Date(endDate); // Convert end date string to Date object
            filterStartDate.setHours(0);
            filterEndDate.setSeconds(59);
            filterEndDate.setMinutes(59);
            filterEndDate.setHours(23);
            const receiverMatch = selectedConsignment
            ? item.CONSIGNMENTNUMBER.toLowerCase().includes(
                  selectedConsignment.toLowerCase()
              )
            : true;
            return (
                itemDate >= filterStartDate &&
                itemDate <= filterEndDate &&
                receiverMatch &&
                chargeToMatch
            ); // Compare the item date to the filter dates
        });
        setCurrentPage(0);
        setFilteredData(filtered);
    };
    useEffect(() => {
        filterData(SDate, EDate, selectedConsignment);
    }, [accData]);
    const checkbox = useRef();
    const [checked, setChecked] = useState(false);
    const [indeterminate, setIndeterminate] = useState(false);
    const [selectedPeople, setSelectedPeople] = useState([]);

    useLayoutEffect(() => {
        const isIndeterminate =
            selectedPeople.length > 0 &&
            selectedPeople.length < filteredData?.length;
        setChecked(selectedPeople.length === filteredData?.length);
        setIndeterminate(isIndeterminate);
        checkbox.current.indeterminate = isIndeterminate;
    }, [selectedPeople]);

    function toggleAll() {
        setSelectedPeople(checked || indeterminate ? [] : filteredData);
        setChecked(!checked && !indeterminate);
        setIndeterminate(false);
    }

    const [currentPage, setCurrentPage] = useState(0);

    const PER_PAGE = 15;
    const OFFSET = currentPage * PER_PAGE;
    const handlePageClick = (selectedPage) => {
        setCurrentPage(selectedPage.selected);
    };

    const pageCount = Math.ceil(filteredData?.length / PER_PAGE);
    const tableRef = useRef(null);
    const headers = [
        "Consignemnt Number",
        "Status",
        "Sender Name",
        "Sender State",
        "Receiver Name",
        "Receiver State",
        "Service",
        "KPI DateTime",
        "RDD",
        "Arrived Date Time",
        "Delivered Datetime",
        "POD",
        "State",
        "Reason",
        "Main Cause",
        "Reference",
        "Department",
        "Resolution",
        "OccuredAt",
        "Explanation",
    ];

    const { onDownload } = useDownloadExcel({
        currentTableRef: tableRef.current,
        filename: "Consignments table",
        sheet: "Consignments",
    });

    function handleDownloadExcel() {
        // Get the selected columns or use all columns if none are selected
        let selectedColumns = Array.from(
            document.querySelectorAll('input[name="column"]:checked')
        ).map((checkbox) => checkbox.value);

        if (selectedColumns.length === 0) {
            selectedColumns = headers; // Use all columns
        }

        // Extract the data for the selected columns
        const data = selectedPeople.map((person) =>
            selectedColumns.reduce((acc, column) => {
                const columnKey = column.replace(/\s+/g, "");
                if (columnKey) {
                    if (person[columnKey] === true) {
                        acc[columnKey] = "true";
                    } else if (person[columnKey] === false) {
                        acc[columnKey] = "false";
                    } else if (column.toUpperCase() === "KPI DATETIME") {
                        acc[columnKey] =
                            moment(
                                person["KPI DATETIME"].replace("T", " "),
                                "YYYY-MM-DD HH:mm:ss"
                            ).format("DD-MM-YYYY h:mm A") == "Invalid date"
                                ? ""
                                : moment(
                                      person["KPI DATETIME"].replace("T", " "),
                                      "YYYY-MM-DD HH:mm:ss"
                                  ).format("DD-MM-YYYY h:mm A");
                    } else if (column.toUpperCase() === "ARRIVED DATE TIME") {
                        acc[columnKey] =
                            moment(
                                person["ARRIVEDDATETIME"].replace("T", " "),
                                "YYYY-MM-DD HH:mm:ss"
                            ).format("DD-MM-YYYY h:mm A") == "Invalid date"
                                ? ""
                                : moment(
                                      person["ARRIVEDDATETIME"].replace(
                                          "T",
                                          " "
                                      ),
                                      "YYYY-MM-DD HH:mm:ss"
                                  ).format("DD-MM-YYYY h:mm A");
                    } else if (column.toUpperCase() === "RDD") {
                        acc[columnKey] =
                            moment(
                                person["DELIVERYREQUIREDDATETIME"].replace(
                                    "T",
                                    " "
                                ),
                                "YYYY-MM-DD HH:mm:ss"
                            ).format("DD-MM-YYYY h:mm A") == "Invalid date"
                                ? ""
                                : moment(
                                      person[
                                          "DELIVERYREQUIREDDATETIME"
                                      ].replace("T", " "),
                                      "YYYY-MM-DD HH:mm:ss"
                                  ).format("DD-MM-YYYY h:mm A");
                    } else if (column.toUpperCase() === "DELIVERED DATETIME") {
                        acc[columnKey] =
                            moment(
                                person["DELIVEREDDATETIME"].replace("T", " "),
                                "YYYY-MM-DD HH:mm:ss"
                            ).format("DD-MM-YYYY h:mm A") == "Invalid date"
                                ? ""
                                : moment(
                                      person["DELIVEREDDATETIME"].replace(
                                          "T",
                                          " "
                                      ),
                                      "YYYY-MM-DD HH:mm:ss"
                                  ).format("DD-MM-YYYY h:mm A");
                    } else if (column.toUpperCase() === "OCCUREDAT") {
                        acc[columnKey] =
                            moment(
                                person["DELIVEREDDATETIME"].replace("T", " "),
                                "YYYY-MM-DD HH:mm:ss"
                            ).format("DD-MM-YYYY h:mm A") == "Invalid date"
                                ? ""
                                : moment(
                                      person["DELIVEREDDATETIME"].replace(
                                          "T",
                                          " "
                                      ),
                                      "YYYY-MM-DD HH:mm:ss"
                                  ).format("DD-MM-YYYY h:mm A");
                    } else if (column === "Consignemnt Number") {
                        acc[columnKey] = person["CONSIGNMENTNUMBER"];
                    } else if (columnKey === "Reason") {
                        const failedReason = failedReasons?.find(
                            (reason) => reason.ReasonId === person.FailedReason
                        );
                        acc[columnKey] = failedReason?.ReasonName;
                    }else if (columnKey === "SenderState") {
                        acc[columnKey] = person["SenderState"];
                    } else if (columnKey === "MainCause") {
                        acc[columnKey] = person["FailedReasonDesc"];
                    } else if (columnKey === "Explanation") {
                        acc[columnKey] = person["FailedNote"];
                    } else if (columnKey === "Reference") {
                        if (person["Reference"] == 1) {
                            acc[columnKey] = "Internal";
                        } else if (person["Reference"] == 2) {
                            acc[columnKey] = "External";
                        } else {
                            acc[columnKey] = "";
                        }
                    } else if (columnKey === "Resolution") {
                        acc[columnKey] = person["Resolution"];
                    } else if (columnKey === "Department") {
                        acc[columnKey] = person["Department"];
                    } else if (columnKey === "State") {
                        acc[columnKey] = person["State"];
                    } else {
                        acc[columnKey] = person[columnKey.toUpperCase()];
                    }
                    
                } else {
                    acc[columnKey] = person[columnKey.toUpperCase()];
                }

                return acc;
            }, {})
        );

        // Create a new workbook
        const workbook = new ExcelJS.Workbook();

        // Add a worksheet to the workbook
        const worksheet = workbook.addWorksheet("Sheet1");

        // Apply custom styles to the header row
        const headerRow = worksheet.addRow(selectedColumns);
        headerRow.font = { bold: true };
        headerRow.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFE2B540" }, // Yellow background color (#e2b540)
        };
        headerRow.alignment = { horizontal: "center" };

        // Add the data to the worksheet
        data.forEach((rowData) => {
            worksheet.addRow(Object.values(rowData));
        });

        // Set column widths
        const columnWidths = selectedColumns.map(() => 15); // Set width of each column
        worksheet.columns = columnWidths.map((width, index) => ({
            width,
            key: selectedColumns[index],
        }));

        // Generate the Excel file
        workbook.xlsx.writeBuffer().then((buffer) => {
            // Convert the buffer to a Blob
            const blob = new Blob([buffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });

            // Save the file using FileSaver.js or alternative method
            saveAs(blob, "Failed-Consignments.xlsx");
        });
    }
    const updateLocalData = (
        id,
        reasonid,
        note,
        description,
        department,
        resolution,
        reference,
        state,
        OccuredAt
    ) => {
        // Find the item in the local data with the matching id
        const updatedData = filteredData?.map((item) => {
            if (item.CONSIGNMNENTID === id) {
                // Update the reason of the matching item
                return {
                    ...item,
                    FailedReason: reasonid,
                    FailedReasonDesc: description,
                    FailedNote: note,
                    Department: department,
                    Resolution: resolution,
                    Reference: reference,
                    State: state,
                    OccuredAt: OccuredAt,
                };
            }
            return item;
        });
        setData(updatedData);
        setFilteredData(updatedData);
    };

    const [hoverMessage, setHoverMessage] = useState("");
    const [isMessageVisible, setMessageVisible] = useState(false);

    const handleMouseEnter = () => {
        if (selectedPeople.length === 0) {
            setHoverMessage("Please select a row");
            setMessageVisible(true);
            setTimeout(() => {
                setMessageVisible(false);
            }, 2000);
        }
    };
    return (
        <div>
            {/* <Sidebar /> */}

            <div className=" w-full bg-smooth ">
                <div className="mt-8">
                    <div className="w-full relative">
                        <div className=" sm:border-gray-200 text-gray-400 flex flex-col justify-between md:flex-row gap-y-4 gap-x-2 md:items-center">
                            <label
                                htmlFor="last-name"
                                className="inline-block text-sm font-medium leading-6  flex-item items-center"
                            >
                                Date From
                            </label>
                            <div className="sm:mt-0 md:px-4 ">
                                <input
                                    type="date"
                                    name="from-date"
                                    onKeyDown={(e) => e.preventDefault()}
                                    value={SDate}
                                    min={oldestDate}
                                    max={EDate}
                                    onChange={handleStartDateChange}
                                    id="from-date"
                                    className="flex-item block w-full max-w-lg h-[36px] rounded-md border-0 py-1.5 text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                />
                            </div>

                            <label
                                htmlFor="last-name"
                                className="inline-block text-sm font-medium leading-6 flex-item"
                            >
                                To
                            </label>

                            <div className="mt-2 flex-item  sm:mt-0 md:px-4">
                                <input
                                    type="date"
                                    name="to-date"
                                    onKeyDown={(e) => e.preventDefault()}
                                    value={EDate}
                                    min={SDate}
                                    max={latestDate}
                                    onChange={handleEndDateChange}
                                    id="to-date"
                                    className="block w-full max-w-lg h-[36px]  rounded-md border-0 py-1.5 text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                />
                            </div>
                            <div className="w-72 flex-item w-full sm:max-w-xs max-w-lg">
                                <div className="relative border rounded">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="absolute top-0 bottom-0 w-4 h-4 my-auto text-gray-400 left-3"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        />
                                    </svg>
                                    <input
                                        type="text"
                                        placeholder="Con. No."
                                        onChange={(e) =>
                                            handleConsignmentChange(
                                                e.target.value
                                            )
                                        }
                                        className="w-full py-0.5 h-[36px] pl-12 pr-4 text-gray-500 border-none rounded-md outline-none "
                                    />
                                </div>
                            </div>
                            <Popover className="relative object-right flex-item md:ml-auto">
                                <button onMouseEnter={handleMouseEnter}>
                                    <Popover.Button
                                        className={`inline-flex items-center w-[5.5rem] h-[36px] rounded-md border ${
                                            selectedPeople.length === 0
                                                ? "bg-gray-300 cursor-not-allowed"
                                                : "bg-gray-800"
                                        } px-4 py-2 text-xs font-medium leading-4 text-white shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                                        disabled={selectedPeople.length === 0}
                                    >
                                        Export
                                        <ChevronDownIcon
                                            className="h-5 w-5"
                                            aria-hidden="true"
                                        />
                                    </Popover.Button>
                                </button>
                                {isMessageVisible && (
                                    <div className="absolute top-7 -left-14 right-0 bg-red-200 text-dark text-xs py-2 px-4 rounded-md opacity-100 transition-opacity duration-300">
                                        {hoverMessage}
                                    </div>
                                )}

                                <Transition
                                    as={Fragment}
                                    enter="transition ease-out duration-200"
                                    enterFrom="opacity-0 translate-y-1"
                                    enterTo="opacity-100 translate-y-0"
                                    leave="transition ease-in duration-150"
                                    leaveFrom="opacity-100 translate-y-0"
                                    leaveTo="opacity-0 translate-y-1"
                                >
                                    <Popover.Panel className="absolute left-20 lg:-left-5 z-10 mt-5 flex w-screen max-w-max -translate-x-1/2 px-4">
                                        <div className=" max-w-md flex-auto overflow-hidden rounded-lg bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
                                            <div className="p-4">
                                                <div className="mt-2 flex flex-col">
                                                    <label className="">
                                                        <input
                                                            type="checkbox"
                                                            name="column"
                                                            value="CONSIGNMENTNUMBER"
                                                            className="text-dark focus:ring-goldd rounded "
                                                        />{" "}
                                                        Consignment Number
                                                    </label>
                                                    <label>
                                                        <input
                                                            type="checkbox"
                                                            name="column"
                                                            value="STATUS"
                                                            className="text-dark rounded focus:ring-goldd"
                                                        />{" "}
                                                        Status
                                                    </label>
                                                    <label>
                                                        <input
                                                            type="checkbox"
                                                            name="column"
                                                            value="SENDERNAME"
                                                            className="text-dark rounded focus:ring-goldd"
                                                        />{" "}
                                                        Sender
                                                    </label>
                                                    <label>
                                                        <input
                                                            type="checkbox"
                                                            name="column"
                                                            value="SenderState"
                                                            className="text-dark rounded focus:ring-goldd"
                                                        />{" "}
                                                        Sender State
                                                    </label>
                                                    <label>
                                                        <input
                                                            type="checkbox"
                                                            name="column"
                                                            value="RECEIVERNAME"
                                                            className="text-dark rounded focus:ring-goldd"
                                                        />{" "}
                                                        Receiver
                                                    </label>
                                                    <label>
                                                        <input
                                                            type="checkbox"
                                                            name="column"
                                                            value="RECEIVERSTATE"
                                                            className="text-dark rounded focus:ring-goldd"
                                                        />{" "}
                                                        Receiver State
                                                    </label>
                                                    <label>
                                                        <input
                                                            type="checkbox"
                                                            name="column"
                                                            value="SERVICE"
                                                            className="text-dark rounded focus:ring-goldd"
                                                        />{" "}
                                                        Service
                                                    </label>
                                                    <label>
                                                        <input
                                                            type="checkbox"
                                                            name="column"
                                                            value="KPI DATETIME"
                                                            className="text-dark rounded focus:ring-goldd"
                                                        />{" "}
                                                        KPI Time
                                                    </label>
                                                    <label>
                                                        <input
                                                            type="checkbox"
                                                            name="column"
                                                            value="DELIVERYREQUIREDDATETIME"
                                                            className="text-dark rounded focus:ring-goldd"
                                                        />{" "}
                                                        Delivery Required
                                                        DateTime
                                                    </label>
                                                    <label>
                                                        <input
                                                            type="checkbox"
                                                            name="column"
                                                            value="ARRIVEDDATETIME"
                                                            className="text-dark rounded focus:ring-goldd"
                                                        />{" "}
                                                        Arrived Date Time
                                                    </label>
                                                    <label className="">
                                                        <input
                                                            type="checkbox"
                                                            name="column"
                                                            value="DELIVEREDDATETIME"
                                                            className="text-dark rounded focus:ring-goldd"
                                                        />{" "}
                                                        Delivery Date
                                                    </label>
                                                    <label className="">
                                                        <input
                                                            type="checkbox"
                                                            name="column"
                                                            value="POD"
                                                            className="text-dark rounded focus:ring-goldd"
                                                        />{" "}
                                                        POD
                                                    </label>
                                                    <label className="">
                                                        <input
                                                            type="checkbox"
                                                            name="column"
                                                            value="Reason"
                                                            className="text-dark rounded focus:ring-goldd"
                                                        />{" "}
                                                        Reason
                                                    </label>
                                                    <label className="">
                                                        <input
                                                            type="checkbox"
                                                            name="column"
                                                            value="State"
                                                            className="text-dark rounded focus:ring-goldd"
                                                        />{" "}
                                                        State
                                                    </label>
                                                    <label className="">
                                                        <input
                                                            type="checkbox"
                                                            name="column"
                                                            value="Reference"
                                                            className="text-dark rounded focus:ring-goldd"
                                                        />{" "}
                                                        Reference
                                                    </label>
                                                    <label className="">
                                                        <input
                                                            type="checkbox"
                                                            name="column"
                                                            value="Department"
                                                            className="text-dark rounded focus:ring-goldd"
                                                        />{" "}
                                                        Department
                                                    </label>
                                                    <label className="">
                                                        <input
                                                            type="checkbox"
                                                            name="column"
                                                            value="Resolution"
                                                            className="text-dark rounded focus:ring-goldd"
                                                        />{" "}
                                                        Resolution
                                                    </label>
                                                    <label className="">
                                                        <input
                                                            type="checkbox"
                                                            name="column"
                                                            value="OccuredAt"
                                                            className="text-dark rounded focus:ring-goldd"
                                                        />{" "}
                                                        Occured At
                                                    </label>
                                                    <label className="">
                                                        <input
                                                            type="checkbox"
                                                            name="column"
                                                            value="Main Cause"
                                                            className="text-dark rounded focus:ring-goldd"
                                                        />{" "}
                                                        Main Cause
                                                    </label>
                                                    <label className="">
                                                        <input
                                                            type="checkbox"
                                                            name="column"
                                                            value="Explanation"
                                                            className="text-dark rounded focus:ring-goldd"
                                                        />{" "}
                                                        Explanation
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 divide-x divide-gray-900/5 bg-gray-50">
                                                <button
                                                    onClick={
                                                        handleDownloadExcel
                                                    }
                                                    className="flex items-center justify-center gap-x-2.5 p-3 font-semibold text-gray-900 hover:bg-gray-100"
                                                >
                                                    Export XLS
                                                </button>
                                            </div>
                                        </div>
                                    </Popover.Panel>
                                </Transition>
                            </Popover>
                        </div>
                    </div>
                </div>
                <div className="mt-8 flow-root  bg-white ">
                    <div className="w-full border rounded-lg overflow-x-auto containerscroll">
                        <div className="inline-block min-w-full  align-middle ">
                            <div className="relative">
                                {selectedPeople.length > 0 && (
                                    <div className="absolute left-14 top-0 flex h-12 items-center space-x-3 bg-white sm:left-12">
                                        {/* <button
                                            type="button"
                                            className="inline-flex items-center rounded bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                                        >
                                            Bulk edit
                                        </button>
                                        <button
                                            type="button"
                                            className="inline-flex items-center rounded bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                                        >
                                            Delete all
                                        </button> */}
                                    </div>
                                )}
                                <table className="min-w-full table-fixed divide-y divide-gray-300">
                                    <thead className="h-12">
                                        <tr className="py-2.5">
                                            <th
                                                scope="col"
                                                className="relative px-7 sm:w-12 sm:px-6"
                                            >
                                                <input
                                                    type="checkbox"
                                                    className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-dark focus:ring-goldd"
                                                    ref={checkbox}
                                                    checked={checked}
                                                    onChange={toggleAll}
                                                />
                                            </th>
                                            <th
                                                scope="col"
                                                className="min-w-[8rem] py-3.5 pr-3 text-left text-sm font-semibold text-gray-900"
                                            >
                                                Con No.
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3  text-left text-sm font-semibold text-gray-600"
                                            >
                                                Status
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3  text-left text-sm font-semibold text-gray-600"
                                            >
                                                Sender
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3  text-left text-sm font-semibold text-gray-600"
                                            >
                                                Sender State
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3  text-left text-sm font-semibold text-gray-600"
                                            >
                                                Receiver
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3  text-left text-sm font-semibold text-gray-600"
                                            >
                                                Receiver State
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3  text-left text-sm font-semibold text-gray-600"
                                            >
                                                Service
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3  text-left text-sm font-semibold text-gray-600"
                                            >
                                                KPI Time
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3  text-left text-sm font-semibold text-gray-600"
                                            >
                                                RDD
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3  text-left text-sm font-semibold text-gray-600"
                                            >
                                                Arrived time
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3  text-left text-sm font-semibold text-gray-600"
                                            >
                                                Delivered time
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3  text-left text-sm font-semibold text-gray-600"
                                            >
                                                POD
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3  text-left text-sm font-semibold text-gray-600"
                                            >
                                                Reason
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3  text-left text-sm font-semibold text-gray-600"
                                            >
                                                Main Cause
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3  text-left text-sm font-semibold text-gray-600"
                                            >
                                                State
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3  text-left text-sm font-semibold text-gray-600"
                                            >
                                                Reference
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3  text-left text-sm font-semibold text-gray-600"
                                            >
                                                Department
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3  text-left text-sm font-semibold text-gray-600"
                                            >
                                                Resolution
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3  text-left text-sm font-semibold text-gray-600"
                                            >
                                                Occured At
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3  text-left text-sm font-semibold text-gray-600"
                                            >
                                                Explanation
                                            </th>

                                            {Roles.includes(
                                                currentUser.role_id
                                            ) ? (
                                                <th
                                                    scope="col"
                                                    className="px-3  text-left text-sm font-semibold text-gray-600"
                                                >
                                                    <span className="sr-only">
                                                        Edit
                                                    </span>
                                                </th>
                                            ) : (
                                                <div></div>
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-300 ">
                                        {filteredData?.length > 0 ? (
                                            filteredData
                                                .slice(
                                                    OFFSET,
                                                    OFFSET + PER_PAGE
                                                )
                                                .map((person, index) => (
                                                    <tr
                                                        key={
                                                            person[
                                                                "CONSIGNMNENTID"
                                                            ]
                                                        }
                                                        className={[
                                                            selectedPeople.includes(
                                                                person
                                                            )
                                                                ? "bg-gray-50"
                                                                : "cursor-pointer",
                                                            index % 2 === 0
                                                                ? "bg-smooth"
                                                                : "bg-white",
                                                        ].join(" ")}
                                                    >
                                                        <td className="relative px-7 sm:w-12 sm:px-6">
                                                            {selectedPeople.includes(
                                                                person
                                                            ) && (
                                                                <div className="absolute inset-y-0 left-0 w-0.5 bg-goldd" />
                                                            )}
                                                            <input
                                                                v
                                                                type="checkbox"
                                                                className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-dark focus:ring-goldd"
                                                                value={
                                                                    person[
                                                                        "CONSIGNMNENTID"
                                                                    ]
                                                                }
                                                                checked={selectedPeople.includes(
                                                                    person
                                                                )}
                                                                onChange={(e) =>
                                                                    setSelectedPeople(
                                                                        e.target
                                                                            .checked
                                                                            ? [
                                                                                  ...selectedPeople,
                                                                                  person,
                                                                              ]
                                                                            : selectedPeople.filter(
                                                                                  (
                                                                                      p
                                                                                  ) =>
                                                                                      p !==
                                                                                      person
                                                                              )
                                                                    )
                                                                }
                                                            />
                                                        </td>
                                                        <td
                                                            onClick={() =>
                                                                handleClick(
                                                                    person.CONSIGNMNENTID
                                                                )
                                                            }
                                                            className={classNames(
                                                                "whitespace-nowrap  pr-3 text-sm font-medium",
                                                                selectedPeople.includes(
                                                                    person
                                                                )
                                                                    ? "text-indigo-600"
                                                                    : "text-blue-600 underline hover:cursor-pointer"
                                                            )}
                                                        >
                                                            {
                                                                person[
                                                                    "CONSIGNMENTNUMBER"
                                                                ]
                                                            }
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                                                            {person["STATUS"]}
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                                                            {
                                                                person[
                                                                    "SENDERNAME"
                                                                ]
                                                            }
                                                        </td>

                                                        <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                                                            {
                                                                person[
                                                                    "SenderState"
                                                                ]
                                                            }
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                                                            {
                                                                person[
                                                                    "RECEIVERNAME"
                                                                ]
                                                            }
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                                                            {
                                                                person[
                                                                    "RECEIVERSTATE"
                                                                ]
                                                            }
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                                                            {person["SERVICE"]}
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                                                            {person[
                                                                "KPI DATETIME"
                                                            ]
                                                                ? moment(
                                                                      person[
                                                                          "KPI DATETIME"
                                                                      ].replace(
                                                                          "T",
                                                                          " "
                                                                      ),
                                                                      "YYYY-MM-DD HH:mm:ss"
                                                                  ).format(
                                                                      "DD-MM-YYYY h:mm A"
                                                                  )
                                                                : null}
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                                                            {person[
                                                                "DELIVERYREQUIREDDATETIME"
                                                            ]
                                                                ? moment(
                                                                      person[
                                                                          "DELIVERYREQUIREDDATETIME"
                                                                      ].replace(
                                                                          "T",
                                                                          " "
                                                                      ),
                                                                      "YYYY-MM-DD HH:mm:ss"
                                                                  ).format(
                                                                      "DD-MM-YYYY h:mm A"
                                                                  )
                                                                : null}
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                                                            {person[
                                                                "ARRIVEDDATETIME"
                                                            ]
                                                                ? moment(
                                                                      person[
                                                                          "ARRIVEDDATETIME"
                                                                      ].replace(
                                                                          "T",
                                                                          " "
                                                                      ),
                                                                      "YYYY-MM-DD HH:mm:ss"
                                                                  ).format(
                                                                      "DD-MM-YYYY h:mm A"
                                                                  )
                                                                : null}
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                                                            {person[
                                                                "DELIVEREDDATETIME"
                                                            ]
                                                                ? moment(
                                                                      person[
                                                                          "DELIVEREDDATETIME"
                                                                      ].replace(
                                                                          "T",
                                                                          " "
                                                                      ),
                                                                      "YYYY-MM-DD HH:mm:ss"
                                                                  ).format(
                                                                      "DD-MM-YYYY h:mm A"
                                                                  )
                                                                : null}
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                                                            {person["POD"] ? (
                                                                <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-sm font-medium text-green-800">
                                                                    true
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-0.5 text-sm font-medium text-red-800">
                                                                    false
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                            {
                                                                failedReasons?.find(
                                                                    (reason) =>
                                                                        reason.ReasonId ===
                                                                        person.FailedReason
                                                                )?.ReasonName
                                                            }
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                            <div className="w-[10rem] truncate">
                                                                {
                                                                    person[
                                                                        "FailedReasonDesc"
                                                                    ]
                                                                }
                                                            </div>
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                            {person["State"]}
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-2.5 text-sm text-gray-500">
                                                            {person[
                                                                "Reference"
                                                            ] === 1
                                                                ? "Internal"
                                                                : person[
                                                                      "Reference"
                                                                  ] === 2
                                                                ? "External"
                                                                : ""}
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                            {
                                                                person[
                                                                    "Department"
                                                                ]
                                                            }
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                            {
                                                                person[
                                                                    "Resolution"
                                                                ]
                                                            }
                                                        </td>

                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 truncate ">
                                                            <div className="w-[10rem] truncate">
                                                                {person[
                                                                    "OccuredAt"
                                                                ]
                                                                    ? moment(
                                                                          person[
                                                                              "OccuredAt"
                                                                          ].replace(
                                                                              "T",
                                                                              " "
                                                                          ),
                                                                          "YYYY-MM-DD HH:mm:ss"
                                                                      ).format(
                                                                          "DD-MM-YYYY h:mm A"
                                                                      )
                                                                    : null}
                                                            </div>
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 truncate ">
                                                            <div className="w-[10rem] truncate">
                                                                {
                                                                    person[
                                                                        "FailedNote"
                                                                    ]
                                                                }
                                                            </div>
                                                        </td>

                                                        {Roles.includes(
                                                            currentUser.role_id
                                                        ) ? (
                                                            <td className="relative whitespace-nowrap py-4 pl-3 sm:pr-4 pr-6 text-left text-sm font-medium">
                                                                <a
                                                                    href="#"
                                                                    onClick={() =>
                                                                        handleEditClick(
                                                                            person
                                                                        )
                                                                    }
                                                                    className=" text-blue-500 hover:text-blue-900 flex"
                                                                >
                                                                    <PencilIcon className="w-5 h-5" />
                                                                    <span className="ml-2">
                                                                        Edit
                                                                    </span>
                                                                    <span className="sr-only">
                                                                        , reason
                                                                    </span>
                                                                </a>
                                                            </td>
                                                        ) : (
                                                            <div></div>
                                                        )}
                                                    </tr>
                                                ))
                                        ) : (
                                            <tr>
                                                <td colSpan="20">
                                                    <div class=" h-72 flex items-center justify-center mt-5">
                                                        <div class="text-center flex justify-center flex-col">
                                                            <img
                                                                src={notFound}
                                                                alt=""
                                                                className="w-52 h-auto "
                                                            />
                                                            <h1 class="text-3xl font-bold text-gray-900">
                                                                No Data Found
                                                            </h1>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="pt-4 pb-10 text-xs text-gray-400">
                        <ReactPaginate
                            previousLabel={"← Previous"}
                            nextLabel={"Next →"}
                            pageCount={pageCount}
                            onPageChange={handlePageClick}
                            containerClassName={
                                "flex justify-center items-center mt-4"
                            }
                            pageClassName={
                                "mx-2 rounded-full hover:bg-gray-100"
                            }
                            previousLinkClassName={
                                "px-3 py-2 bg-gray-100 text-gray-700 rounded-l hover:bg-gray-200"
                            }
                            nextLinkClassName={
                                "px-3 py-2 bg-gray-100 text-gray-700 rounded-r hover:bg-gray-200"
                            }
                            disabledClassName={"opacity-50 cursor-not-allowed"}
                            activeClassName={"text-blue-500 font-bold"}
                        />
                    </div>
                </div>
            </div>
            <SetFailedReasonModal
                url={url}
                isOpen={isModalOpen}
                reason={reason}
                setReason={setReason}
                handleClose={handleEditClick}
                failedReasons={failedReasons}
                currentUser={currentUser}
                updateLocalData={updateLocalData}
            />
        </div>
    );
}
