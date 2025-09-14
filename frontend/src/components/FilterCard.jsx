import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import { Filter, X, ChevronDown } from 'lucide-react';

const filterData = [
    {
        filterType: "Location",
        array: ["Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Mumbai", "Remote"]
    },
    {
        filterType: "Industry",
        array: ["Frontend Developer", "Backend Developer", "FullStack Developer", "DevOps"]
    },
    {
        filterType: "Salary",
        array: ["0-5 LPA", "6-15 LPA", "16-30 LPA", "30+ LPA"]
    },
];

const FilterCard = () => {
    const [selectedValue, setSelectedValue] = useState('');
    const dispatch = useDispatch();

    const changeHandler = (value) => {
        setSelectedValue(value);
    };
    
    const clearFilters = () => {
        setSelectedValue('');
    };

    useEffect(() => {
        dispatch(setSearchedQuery(selectedValue));
    }, [selectedValue, dispatch]);

    return (
        <div className='w-full bg-white p-5 rounded-xl shadow-lg border border-gray-100'>
            <div className='flex items-center justify-between pb-4 border-b'>
                <div className="flex items-center gap-2">
                    <Filter className="h-5 w-5 text-purple-600"/>
                    <h1 className='font-bold text-lg text-gray-800'>Filters</h1>
                </div>
                <button 
                    onClick={clearFilters} 
                    className="text-sm text-gray-500 hover:text-purple-600 flex items-center gap-1 transition-colors"
                >
                    <X size={14}/>
                    Clear All
                </button>
            </div>
            
            <div className="mt-4 space-y-4">
                {filterData.map((data, index) => (
                    <FilterSection 
                        key={index} 
                        title={data.filterType}
                        options={data.array}
                        selectedValue={selectedValue}
                        onChange={changeHandler}
                    />
                ))}
            </div>
        </div>
    );
};

// Accordion-style section for each filter category
const FilterSection = ({ title, options, selectedValue, onChange }) => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="py-4 border-b last:border-b-0">
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="w-full flex justify-between items-center"
            >
                <h2 className="font-semibold text-gray-700">{title}</h2>
                <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="mt-4 space-y-3">
                    {options.map((item, idx) => {
                        const itemId = `${title.toLowerCase()}-${idx}`;
                        return (
                            <label key={itemId} htmlFor={itemId} className="flex items-center space-x-3 cursor-pointer group">
                                <input
                                    type="radio"
                                    id={itemId}
                                    name="filter-option" // A common name ensures only one can be selected
                                    value={item}
                                    checked={selectedValue === item}
                                    onChange={(e) => onChange(e.target.value)}
                                    className="peer hidden"
                                />
                                {/* Custom Radio Button */}
                                <div className="w-5 h-5 border-2 border-gray-300 rounded-full flex items-center justify-center transition-all group-hover:border-purple-400 peer-checked:border-purple-600">
                                    <div className="w-2.5 h-2.5 bg-purple-600 rounded-full scale-0 peer-checked:scale-100 transition-transform"></div>
                                </div>
                                <span className="text-gray-600 group-hover:text-black peer-checked:font-semibold peer-checked:text-purple-700 transition-colors">
                                    {item}
                                </span>
                            </label>
                        )
                    })}
                </div>
            )}
        </div>
    );
};

export default FilterCard;