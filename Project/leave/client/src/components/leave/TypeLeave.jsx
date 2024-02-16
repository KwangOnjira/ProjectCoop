import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const TypeLeave = () => {
    const navigate = useNavigate()
    const [selectType, setSelectType] = useState('')

    const handleChange = (e) =>{
        setSelectType(e.target.value)
    }

    const handleNext = ()=>{
        navigate(`/leave/${selectType}`)
    }
  return (
    <div>
        <select id="leaveType" value={selectType} onChange={handleChange}>
        <option value="">Select...</option>
        <option value="vacationleave">Vacation Leave</option>
        <option value="sickleave">Sick Leave</option>
        <option value="personalleave">Personal Leave</option>
        <option value="maternityleave">Maternity Leave</option>
        <option value="ordinationleave">Ordination Leave</option>
        <option value="studyleave">Study Leave</option>
      </select>
      <button onClick={handleNext} disabled={!selectType}>
        Next
      </button>
    </div>
  )
}

export default TypeLeave