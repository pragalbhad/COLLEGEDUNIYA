import React, { useState, useCallback } from 'react';
import { dummyColleges } from '../DummyCollgeData';
import GenericModal from '../GenericModal';
import { MdCompareArrows } from "react-icons/md";
import { FaArrowRight } from "react-icons/fa6";
import { MdFileDownload } from "react-icons/md";
import { FaCheck } from "react-icons/fa6";
import { RiArrowDropDownLine } from "react-icons/ri";
import { FaCircle } from "react-icons/fa6";
import '../../assests/CollegeDuniaTable.scss';

export default function CollegeDuniaTable() {
    const [compareFeeModal, setCompareFeeModal] = useState(false);
    const [camparePlacementModal, setCamparePlacementModal] = useState(false);

    const [visibleRows, setVisibleRows] = useState(10);

    const [searchTerm, setSearchTerm] = useState("");
    const [sortColumn, setSortColumn] = useState(null);
    const [sortOrder, setSortOrder] = useState("asc");

    const [targetId, setTargetId] = useState(null);

    const handleScroll = useCallback((e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        if (scrollTop + clientHeight >= scrollHeight - 100) {
            setVisibleRows((prev) => prev + 10);
        }
    }, []);

    const filteredAndSortedColleges = dummyColleges
        .filter((college) =>
            college.college_name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            if (!sortColumn) return 0;

            let valueA, valueB;

            if (sortColumn === "fees") {
                valueA = a.fees && a.fees.length > 0 ? Math.min(...a.fees.map(fee => fee.fee)) : 0;
                valueB = b.fees && b.fees.length > 0 ? Math.min(...b.fees.map(fee => fee.fee)) : 0;
            } else {
                valueA = a[sortColumn];
                valueB = b[sortColumn];
            }

            if (typeof valueA === "string") {
                return sortOrder === "asc"
                    ? valueA.localeCompare(valueB)
                    : valueB.localeCompare(valueA);
            } else if (typeof valueA === "number") {
                return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
            }

            return 0;
        });

    const handleCloseCompareFeeModal = () => setCompareFeeModal(false);
    const handleCloseComparePlacementModal = () => setCamparePlacementModal(false);

    const handleSortChange = (e) => {
        const [column, order] = e.target.value.split("-");
        console.log(column, 'column')
        setSortColumn(column);
        setSortOrder(order);
    };

    const targetCollege = dummyColleges.find((college) => college.college_id === targetId);
    const targetCollegePlacement = dummyColleges.find((college) => college.college_id === targetId);

    const fees = targetCollege?.fees || [];
    const placement = targetCollegePlacement?.college_placements || [];

    return (
        <div className='college-dunia-container'>
            <div className='m-4'>
                <h3>Total Colleges: {dummyColleges.length}</h3>
            </div>

            <div className="search-container" style={{ marginBottom: "10px" }}>
                <input
                    type="text"
                    placeholder="Search Colleges"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className='search-field'
                />
            </div>

            <div className="sort-dropdown">
                <label htmlFor="sort">Sort By: </label>
                <select id="sort" onChange={handleSortChange}>
                    <option value="">Select</option>
                    <option value="college_id-asc">CD Rank (Ascending)</option>
                    <option value="college_id-desc">CD Rank (Descending)</option>
                    <option value="college_name-asc">Colleges (A-Z)</option>
                    <option value="college_name-desc">Colleges (Z-A)</option>
                    <option value="fees-asc">Course Fees (Low to High)</option>
                    <option value="fees-desc">Course Fees (High to Low)</option>
                </select>
            </div>

            <div
                onScroll={handleScroll}
                style={{ overflowY: 'auto', maxHeight: '600px', width: "100%", margin: "0 auto" }}
            >
                <table className="main-table" style={{ width: "100%", border: "1px solid #ddd", background: "#e9e9e9" }}>
                    <thead style={{ position: "sticky", top: 0, backgroundColor: "#fff", zIndex: 1 }}>
                        <tr>
                            <th>CD Rank</th>
                            <th>Colleges</th>
                            <th>Course Fees</th>
                            <th>Placement</th>
                            <th>User Reviews</th>
                            <th>Ranking</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredAndSortedColleges.length > 0 ?
                            filteredAndSortedColleges.slice(0, visibleRows).map((college) => (
                                <>

                                    <tr
                                        key={college.college_id}
                                        style={{
                                            whiteSpace: 'no-wrap',
                                            backgroundColor: college.is_feature ? "#fffae6" : "white",
                                        }}
                                    >
                                        <td> #{college.college_id}</td>

                                        <td style={{ whiteSpace: 'no-wrap', width: '28%', position: 'relative' }}>
                                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                                                <div style={{ width: '50px', height: '50px', borderRadius: '50%' }}>
                                                    <img width="100%" height="100%" src={college.logo} alt={college.logo} />
                                                </div>
                                                <div>
                                                    <div className='college-name'>{college.college_name}</div>
                                                    <div>{college.college_city}, {college.state} | {college.exam} {college.approvals.map((approval, index) => (
                                                        <span key={index}>{approval} {college.approvals.length > 1 && ","} &nbsp;</span>
                                                    ))} Approved</div>
                                                </div>

                                                {college.is_feature && <div className='position-absolute feature-tag'>Featured</div>}
                                            </div>

                                            <div className='d-flex justify-between college-detail-btn-wrapper'>
                                                <div className='common-btn apply-now-btn'>
                                                    <span><FaArrowRight /></span>Apply Now
                                                </div>
                                                <div className='common-btn download-btn'>
                                                    <span><MdFileDownload /></span>Download Brochure
                                                </div>
                                            </div>
                                        </td>

                                        <td style={{ whiteSpace: 'no-wrap', width: '18%' }} className='fee-wrapper'>
                                            <div className='fee-value'>
                                                <span>₹</span> <span>{college.fees[0].fee}</span>
                                            </div>

                                            <div className='fee-college-name'>
                                                <div>{college.fees[0].name}</div>
                                                <div>-{college.fees[0].type}</div>
                                            </div>

                                            <div className='common-btn apply-now-btn' onClick={() => { setCompareFeeModal(true); setTargetId(college.college_id); }}>
                                                <span><MdCompareArrows /></span>Compare fees
                                            </div>
                                        </td>

                                        <td style={{ whiteSpace: 'no-wrap', width: '18%' }}>
                                            <div>
                                                <div className='fee-value'> <span>₹</span> {college.placement.average_salary}</div>
                                                <div className='fee-college-name'>Average Package</div>
                                            </div>
                                            <div>
                                                <div className='fee-value'> <span>₹</span> {college.placement.highest_salary}</div>
                                                <div className='fee-college-name'>Highest Salary</div>
                                            </div>

                                            <div onClick={() => setCamparePlacementModal(true)} className='common-btn apply-now-btn'>
                                                <span><MdCompareArrows /></span> Compare Placement
                                            </div>
                                        </td>

                                        <td style={{ whiteSpace: 'no-wrap', width: '18%' }}>
                                            <div><span className='circle-svg'><FaCircle /></span>{college.reviewsData.avgRating} / 5</div>
                                            <div>Based on {college.reviewsData.totalStudent} User Reviews</div>
                                            <div className='best-social-left'>
                                                <span className='check-icon'><FaCheck /></span>
                                                Best in Social Life
                                                <span className='ml-2'><RiArrowDropDownLine /></span>
                                            </div>
                                        </td>

                                        <td style={{ whiteSpace: 'no-wrap', width: '14%' }}>
                                            <div> #{college.rankingData[0].rankingOfCollege}th/{college.rankingData[0].rankingOutOfTotalNoOfCollege}</div>
                                            <div style={{ width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <img width='100%' height='100%' src={college.rankingData[0].logo} alt="ranking" />
                                            </div>
                                        </td>
                                    </tr>
                                </>
                            ))
                            :
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>
                                    <img
                                        src="https://img.freepik.com/premium-vector/no-data-concept-illustration_86047-488.jpg?semt=ais_hybrid"
                                        alt="no-data-found"
                                        style={{ maxWidth: '500px', display: 'block', margin: '0 auto' }}
                                    />
                                    <p style={{ marginTop: '1rem', fontSize: '1.2rem', color: '#555' }}>
                                        No data available
                                    </p>
                                </td>
                            </tr>
                        }
                    </tbody>
                </table>
            </div>

            {compareFeeModal &&
                <GenericModal title="BE/B.Tech - Fees" show={compareFeeModal} onClose={handleCloseCompareFeeModal} >
                    <table className='w-100'>
                        <thead>
                            <tr>
                                <th className='p-2'>College</th>
                                <th className='p-2'>Fees</th>
                            </tr>
                        </thead>

                        <tbody>

                            {fees && fees.map((collegeFee) => (
                                <tr key={collegeFee.course_id}>
                                    <td>
                                        <div className='d-flex gap-2 align-items-center'>
                                            <div><img src={collegeFee.logo} alt={"college logo"} /></div>
                                            <div>{collegeFee.name}</div>
                                        </div>
                                    </td>
                                    <td>
                                        ₹ {collegeFee.fee} - {collegeFee.type}
                                    </td>
                                </tr>
                            ))}

                        </tbody>

                    </table>

                </GenericModal>}

            {camparePlacementModal && <GenericModal title="College Placement Comparison" show={camparePlacementModal} onClose={handleCloseComparePlacementModal} >
                <table className='w-100'>
                    <thead>
                        <tr>
                            <th className='p-2'>College</th>
                            <th className='p-2'>Average Salary</th>
                            <th className='p-2'>Higest Salary</th>
                        </tr>
                    </thead>

                    <tbody>

                        {placement.length > 0 && placement.map((collegeFee, index) => (
                            <tr key={index}>
                                <td>
                                    <div className='d-flex gap-2 align-items-center'>
                                        <div><img src={collegeFee.logo} alt={"college logo"} /></div>
                                        <div>{collegeFee.college_name}</div>
                                    </div>
                                </td>
                                <td>
                                    {collegeFee.average_salary ? `₹ ${collegeFee.average_salary} /-` : '--'}
                                </td>

                                <td>
                                    {collegeFee.highest_salary ? `₹ ${collegeFee.highest_salary} /-` : '--'}
                                </td>
                            </tr>
                        ))}

                    </tbody>

                </table>
            </GenericModal>}

        </div>
    )
}
