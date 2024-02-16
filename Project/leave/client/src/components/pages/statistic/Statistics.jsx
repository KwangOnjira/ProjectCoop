import React, { useState, useEffect } from "react";
import { getStatistic } from "../../../function/statistic";

const Statistics = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getStatistic(localStorage.getItem('token'))
                console.log(response.data);
                setData(response.data);

            } catch (err) {
                console.log('Error Fetching statistics data: ' + err);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="profile-container">
            {data ? (
                <div>
                    <h2>Your CitizenID is: {data[0].citizenID} </h2>
                    {data.map((stat, index) => (
                        <div key={index}>
                            <h2>StatisticID {stat.statisticID} </h2>
                            <ul>
                                <li>Leave Rights: {stat.leave_rights}</li>
                                <li>VL Accumulated Days: {stat.VL_accumulatedDays}</li>
                            </ul>
                        </div>
                    ))}
                </div>
            ) : (
                <p>Loading Statistic data...</p>
            )}
        </div>
    );
};

export default Statistics;
