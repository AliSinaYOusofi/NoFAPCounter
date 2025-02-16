import React from 'react'
import ContributionGraph from './Contribution'
import StreakCharts from './StreakCharts'

export default function ContributionWrapper() {
    return (
        <div className="flex flex-col w-full h-full bg-gradient-to-b from-black via-gray-900 to-black">
            <ContributionGraph />
            <StreakCharts />
        </div>
    )
}
