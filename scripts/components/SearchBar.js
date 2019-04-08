import React from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';
import CreatableSelect from 'react-select/lib/Creatable';

const SearchBar = ({
    selectedOption,
    options,
    handleSelector,
    updateQuery,
    placeholder,
    isMulti,
    type,
    noOptionsMessage
}) => {
    const customStyles = {
        option: (provided) => {
            return {
                ...provided,
                borderBottom: '1px solid grey',
                color: 'black',
                padding: 15,
                cursor: 'pointer'
            };
        },
        multiValue: (styles) => {
            return { ...styles, display: 'none' };
        },
        multiValueLabel: (styles) => {
            return { ...styles, display: 'none' };
        },
        multiValueRemove: (styles) => {
            return { ...styles, display: 'none' };
        },
        dropdownIndicator: (styles) => {
            return { ...styles, display: 'none' };
        },
        clearIndicator: (styles) => {
            return { ...styles, display: 'none' };
        },
        input: (styles) => {
            return {
                ...styles,
                paddingLeft: 0
            };
        },
        control: (styles) => {
            return {
                ...styles,
                '&:hover': { borderColor: '#a243f7' },
                borderColor: 'transparent',
                borderWidth: 2,
                boxShadow: 'none',
                outline: 'none',
                borderRadius: 25,
                cursor: 'auto',
                height: 45
            };
        }
    };

    const creatableSelectStyles = {
        option: (provided) => {
            return {
                ...provided,
                borderBottom: '1px solid grey',
                color: 'black',
                padding: 15,
                cursor: 'pointer'
            };
        },
        dropdownIndicator: (styles) => {
            return { ...styles, display: 'none' };
        },
        indicatorSeparator: (styles) => {
            return { ...styles, display: 'none' };
        },
        control: (styles) => {
            return {
                ...styles,
                '&:hover': { borderColor: '#a243f7' },
                borderColor: 'transparent',
                borderWidth: 2,
                borderRadius: 'none',
                boxShadow: 'none',
                width: 251,
                marginTop: 16,
                marginBottom: 16,
                outline: 'none',
                cursor: 'auto',
                height: 50
            };
        }
    };

    const searchBarType = () => {
        let searchBarType;
        if (type === 'searchBar') {
            searchBarType = (
                <Select
                    value={selectedOption}
                    options={options}
                    onChange={handleSelector}
                    styles={customStyles}
                    backspaceRemovesValue={false}
                    onInputChange={updateQuery}
                    isMulti={isMulti}
                    placeholder={placeholder}
                    classNamePrefix="react-select"
                    noOptionsMessage={noOptionsMessage}
                />
            );
        } else {
            searchBarType = (
                <CreatableSelect
                    onChange={handleSelector}
                    value={selectedOption}
                    onInputChange={updateQuery}
                    isClearable={false}
                    options={options}
                    styles={creatableSelectStyles}
                    backspaceRemovesValue={false}
                    placeholder={placeholder}
                    classNamePrefix="react-select"
                    noOptionsMessage={noOptionsMessage}
                />
            );
        }
        return searchBarType;
    };

    return (
        <div>
            {searchBarType()}
        </div>
    );
};

SearchBar.propTypes = {
    options: PropTypes.arrayOf(PropTypes.object),
    handleSelector: PropTypes.func.isRequired,
    updateQuery: PropTypes.func,
    placeholder: PropTypes.string,
    type: PropTypes.string,
    noOptionsMessage: PropTypes.func,
    isMulti: PropTypes.bool,
    selectedOption: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.object),
        PropTypes.object
    ])
};

export default SearchBar;
