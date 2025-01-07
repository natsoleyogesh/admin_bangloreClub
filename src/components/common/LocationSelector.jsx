// import React, { useState, useEffect } from "react";
// import Select from "react-select";
// import { fetchAllCities, fetchAllCountries, fetchAllStates } from "../../api/masterData/location";


// const LocationSelector = ({ onLocationChange, defaultLocation }) => {
//     const [countries, setCountries] = useState([]);
//     const [states, setStates] = useState([]);
//     const [cities, setCities] = useState([]);

//     const [selectedCountry, setSelectedCountry] = useState(null);
//     const [selectedState, setSelectedState] = useState(null);
//     const [selectedCity, setSelectedCity] = useState(null);

//     // Fetch all countries on mount and set defaults
//     useEffect(() => {
//         const initializeCountries = async () => {
//             const countryOptions = await fetchAllCountries();
//             setCountries(countryOptions);

//             if (defaultLocation?.country) {
//                 const defaultCountryOption = countryOptions.find(
//                     (c) => c.label === defaultLocation.country
//                 );
//                 if (defaultCountryOption) {
//                     setSelectedCountry(defaultCountryOption);

//                     // Fetch and set states
//                     const stateOptions = await fetchAllStates(defaultCountryOption.value);
//                     setStates(stateOptions);

//                     if (defaultLocation?.state) {
//                         const defaultStateOption = stateOptions.find(
//                             (s) => s.label === defaultLocation.state
//                         );
//                         if (defaultStateOption) {
//                             setSelectedState(defaultStateOption);

//                             // Fetch and set cities
//                             const cityOptions = await fetchAllCities(
//                                 defaultCountryOption.value,
//                                 defaultStateOption.value
//                             );
//                             setCities(cityOptions);

//                             if (defaultLocation?.city) {
//                                 const defaultCityOption = cityOptions.find(
//                                     (c) => c.label === defaultLocation.city
//                                 );
//                                 if (defaultCityOption) {
//                                     setSelectedCity(defaultCityOption);
//                                 }
//                             }
//                         }
//                     }
//                 }
//             }
//         };
//         initializeCountries();
//     }, [defaultLocation]);

//     const handleCountryChange = (option) => {
//         setSelectedCountry(option);
//         onLocationChange({
//             country: option?.label || null,
//             state: null,
//             city: null,
//         });
//         setSelectedState(null); // Reset state
//         setSelectedCity(null); // Reset city
//     };

//     const handleStateChange = (option) => {
//         setSelectedState(option);
//         onLocationChange({
//             country: selectedCountry?.label || null,
//             state: option?.label || null,
//             city: null,
//         });
//         setSelectedCity(null); // Reset city
//     };

//     const handleCityChange = (option) => {
//         setSelectedCity(option);
//         onLocationChange({
//             country: selectedCountry?.label || null,
//             state: selectedState?.label || null,
//             city: option?.label || null,
//         });
//     };

//     return (
//         <div>
//             {/* <Select
//                 options={countries}
//                 value={selectedCountry}
//                 onChange={handleCountryChange}
//                 placeholder="Select Country"
//             />
//             <Select
//                 options={states}
//                 value={selectedState}
//                 onChange={handleStateChange}
//                 placeholder="Select State"
//                 isDisabled={!selectedCountry}
//             />
//             <Select
//                 options={cities}
//                 value={selectedCity}
//                 onChange={handleCityChange}
//                 placeholder="Select City"
//                 isDisabled={!selectedState}
//             /> */}
//             <Grid container spacing={2}>
//                 <Grid item xs={6}>
//                     <InputLabel sx={{ fontWeight: "bold" }}>Country</InputLabel>
//                     <Select
//                         options={countries}
//                         value={selectedCountry}
//                         onChange={(e) => setSelectedCountry(e)}
//                         placeholder="Select Your Country"
//                     />
//                 </Grid>

//                 <Grid item xs={6}>
//                     <InputLabel sx={{ fontWeight: "bold" }}>State</InputLabel>
//                     <Select
//                         options={states}
//                         value={selectedState}
//                         onChange={(e) => setSelectedState(e)}
//                         placeholder="Select Your State"
//                         isDisabled={!selectedCountry} // Disable until a country is selected
//                     />
//                 </Grid>

//                 <Grid item xs={6}>
//                     <InputLabel sx={{ fontWeight: "bold" }}>City</InputLabel>
//                     <Select
//                         options={cities}
//                         value={selectedCity}
//                         onChange={(e) => setSelectedCity(e)}
//                         placeholder="Select Your City"
//                         isDisabled={!selectedState} // Disable until a state is selected
//                     />
//                 </Grid>
//             </Grid>
//         </div>
//     );
// };

// export default LocationSelector;


import React, { useState, useEffect } from "react";
import Select from "react-select";
import { Grid, InputLabel, TextField } from "@mui/material";
import { fetchAllCities, fetchAllStates } from "../../api/masterData/location";

const LocationSelector = ({ onLocationChange, defaultLocation = { country: "India" } }) => {
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);

    const [selectedState, setSelectedState] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);

    // Pre-set the default country
    const defaultCountry = { value: "IN", label: defaultLocation.country };

    // Fetch states for the default country on mount
    useEffect(() => {
        const initializeStates = async () => {
            try {
                const stateOptions = await fetchAllStates(defaultCountry.value);
                const formattedStates = stateOptions.map((state) => ({
                    value: state.isoCode,
                    label: state.name,
                }));
                setStates(formattedStates);

                // Pre-select the default state if provided
                if (defaultLocation?.state) {
                    const defaultState = formattedStates.find(
                        (s) => s.label === defaultLocation.state
                    );
                    if (defaultState) {
                        handleStateChange(defaultState, true);
                    }
                }
            } catch (error) {
                console.error("Error fetching states:", error);
            }
        };
        initializeStates();
    }, []);

    // Handle state change
    const handleStateChange = async (option, isDefault = false) => {
        setSelectedState(option);
        setSelectedCity(null); // Reset city
        setCities([]); // Clear cities

        if (option) {
            try {
                const cityOptions = await fetchAllCities(defaultCountry.value, option.value);
                const formattedCities = cityOptions.map((city) => ({
                    value: city.name,
                    label: city.name,
                }));
                setCities(formattedCities);

                // Pre-select the default city if provided
                if (isDefault && defaultLocation?.city) {
                    const defaultCity = formattedCities.find(
                        (c) => c.label === defaultLocation.city
                    );
                    if (defaultCity) {
                        handleCityChange(defaultCity);
                    }
                }
            } catch (error) {
                console.error("Error fetching cities:", error);
            }
        }

        onLocationChange({
            country: defaultCountry.label,
            state: option?.label || null,
            city: null,
        });
    };

    // Handle city change
    const handleCityChange = (option) => {
        setSelectedCity(option);
        onLocationChange({
            country: defaultCountry.label,
            state: selectedState?.label || null,
            city: option?.label || null,
        });
    };

    return (
        <Grid container spacing={2}>
            {/* Country is pre-set to India and not editable */}
            <Grid item xs={6}>
                <InputLabel sx={{ fontWeight: "bold" }}>Country</InputLabel>
                <TextField
                    value={defaultCountry.label}
                    variant="outlined"
                    size="small"
                    disabled // Country is not editable
                    fullWidth
                />
            </Grid>

            {/* State Dropdown */}
            <Grid item xs={6}>
                <InputLabel sx={{ fontWeight: "bold" }}>State</InputLabel>
                <Select
                    options={states}
                    value={selectedState}
                    onChange={handleStateChange}
                    placeholder="Select Your State"
                    isSearchable // Enable search for easier selection
                />
            </Grid>

            {/* City Dropdown */}
            <Grid item xs={6}>
                <InputLabel sx={{ fontWeight: "bold" }}>City</InputLabel>
                <Select
                    options={cities}
                    value={selectedCity}
                    onChange={handleCityChange}
                    placeholder="Select Your City"
                    isDisabled={!selectedState} // Disable until a state is selected
                    isSearchable // Enable search for easier selection
                />
            </Grid>
        </Grid>
    );
};

export default LocationSelector;

