import React, { useState } from 'react';
import {
    Box,
    TextField,
    IconButton,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Chip,
    Paper,
    Autocomplete,
    Popper,
    ClickAwayListener
} from '@mui/material';
import {
    Search as SearchIcon,
    FilterList as FilterIcon,
    Clear as ClearIcon,
    LocationOn as LocationIcon,
    Business as BusinessIcon,
    Category as CategoryIcon
} from '@mui/icons-material';
import { APP_CONSTANTS } from '../../utils/constants';

const SearchBar = ({
    onSearch,
    onFilterChange,
    placeholder = "Search internships...",
    filters = {},
    showAdvancedFilters = true,
    width = '100%'
}) => {
    const [searchText, setSearchText] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleSearch = (e) => {
        e.preventDefault();
        onSearch(searchText);
    };

    const handleClear = () => {
        setSearchText('');
        onSearch('');
    };

    const handleFilterChange = (filterName, value) => {
        onFilterChange({
            ...filters,
            [filterName]: value
        });
    };

    const handleClearFilter = (filterName) => {
        const newFilters = { ...filters };
        delete newFilters[filterName];
        onFilterChange(newFilters);
    };

    const handleToggleFilters = (event) => {
        setAnchorEl(event.currentTarget);
        setShowFilters(!showFilters);
    };

    const handleCloseFilters = () => {
        setShowFilters(false);
        setAnchorEl(null);
    };

    const activeFiltersCount = Object.keys(filters).filter(key => filters[key]).length;

    return (
        <Box sx={{ width, position: 'relative' }}>
            {/* Search Input */}
            <Paper
                component="form"
                onSubmit={handleSearch}
                sx={{
                    p: '2px 4px',
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    borderRadius: 2,
                    boxShadow: 2,
                    '&:hover': {
                        boxShadow: 3
                    }
                }}
            >
                <IconButton type="submit" sx={{ p: '10px' }}>
                    <SearchIcon />
                </IconButton>
                
                <TextField
                    fullWidth
                    placeholder={placeholder}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    variant="standard"
                    InputProps={{
                        disableUnderline: true,
                        sx: { ml: 1, flex: 1 }
                    }}
                />
                
                {searchText && (
                    <IconButton onClick={handleClear} size="small">
                        <ClearIcon />
                    </IconButton>
                )}

                {/* Filter Toggle Button */}
                {showAdvancedFilters && (
                    <IconButton
                        onClick={handleToggleFilters}
                        sx={{ 
                            ml: 1,
                            position: 'relative',
                            color: activeFiltersCount > 0 ? 'primary.main' : 'inherit'
                        }}
                    >
                        <FilterIcon />
                        {activeFiltersCount > 0 && (
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: 4,
                                    right: 4,
                                    width: 16,
                                    height: 16,
                                    borderRadius: '50%',
                                    backgroundColor: 'primary.main',
                                    color: 'white',
                                    fontSize: '0.7rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                {activeFiltersCount}
                            </Box>
                        )}
                    </IconButton>
                )}
            </Paper>

            {/* Active Filters */}
            {activeFiltersCount > 0 && (
                <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {filters.location && (
                        <Chip
                            label={`Location: ${filters.location}`}
                            size="small"
                            icon={<LocationIcon />}
                            onDelete={() => handleClearFilter('location')}
                        />
                    )}
                    {filters.type && (
                        <Chip
                            label={`Type: ${filters.type}`}
                            size="small"
                            onDelete={() => handleClearFilter('type')}
                        />
                    )}
                    {filters.category && (
                        <Chip
                            label={`Category: ${filters.category}`}
                            size="small"
                            icon={<CategoryIcon />}
                            onDelete={() => handleClearFilter('category')}
                        />
                    )}
                    {filters.company && (
                        <Chip
                            label={`Company: ${filters.company}`}
                            size="small"
                            icon={<BusinessIcon />}
                            onDelete={() => handleClearFilter('company')}
                        />
                    )}
                    {filters.minStipend && (
                        <Chip
                            label={`Min Stipend: $${filters.minStipend}`}
                            size="small"
                            onDelete={() => handleClearFilter('minStipend')}
                        />
                    )}
                </Box>
            )}

            {/* Advanced Filters Popper */}
            <Popper
                open={showFilters}
                anchorEl={anchorEl}
                placement="bottom-end"
                sx={{ zIndex: 1300, width: 300 }}
            >
                <ClickAwayListener onClickAway={handleCloseFilters}>
                    <Paper
                        sx={{
                            p: 3,
                            mt: 1,
                            borderRadius: 2,
                            boxShadow: 3,
                            backgroundColor: 'background.paper'
                        }}
                    >
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {/* Location Filter */}
                            <FormControl fullWidth size="small">
                                <InputLabel>Location</InputLabel>
                                <Select
                                    value={filters.location || ''}
                                    label="Location"
                                    onChange={(e) => handleFilterChange('location', e.target.value)}
                                    startAdornment={<LocationIcon sx={{ mr: 1, color: 'text.secondary' }} />}
                                >
                                    <MenuItem value="">Any Location</MenuItem>
                                    {APP_CONSTANTS.LOCATIONS.map((location) => (
                                        <MenuItem key={location} value={location}>
                                            {location}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            {/* Internship Type Filter */}
                            <FormControl fullWidth size="small">
                                <InputLabel>Internship Type</InputLabel>
                                <Select
                                    value={filters.type || ''}
                                    label="Internship Type"
                                    onChange={(e) => handleFilterChange('type', e.target.value)}
                                >
                                    <MenuItem value="">Any Type</MenuItem>
                                    {APP_CONSTANTS.INTERNSHIP_TYPES.map((type) => (
                                        <MenuItem key={type.value} value={type.value}>
                                            {type.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            {/* Category Filter */}
                            <FormControl fullWidth size="small">
                                <InputLabel>Category</InputLabel>
                                <Select
                                    value={filters.category || ''}
                                    label="Category"
                                    onChange={(e) => handleFilterChange('category', e.target.value)}
                                    startAdornment={<CategoryIcon sx={{ mr: 1, color: 'text.secondary' }} />}
                                >
                                    <MenuItem value="">Any Category</MenuItem>
                                    {APP_CONSTANTS.JOB_CATEGORIES.map((category) => (
                                        <MenuItem key={category} value={category}>
                                            {category}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            {/* Min Stipend Filter */}
                            <TextField
                                label="Minimum Stipend"
                                type="number"
                                size="small"
                                value={filters.minStipend || ''}
                                onChange={(e) => handleFilterChange('minStipend', e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <Box sx={{ mr: 1, color: 'text.secondary' }}>$</Box>
                                    )
                                }}
                            />

                            {/* Skills Filter */}
                            <Autocomplete
                                multiple
                                size="small"
                                options={[]}
                                freeSolo
                                value={filters.skills ? filters.skills.split(',') : []}
                                onChange={(event, newValue) => {
                                    handleFilterChange('skills', newValue.join(','));
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Required Skills"
                                        placeholder="Type and press Enter"
                                    />
                                )}
                            />

                            {/* Duration Filter */}
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <TextField
                                    label="Min Duration"
                                    type="number"
                                    size="small"
                                    value={filters.minDuration || ''}
                                    onChange={(e) => handleFilterChange('minDuration', e.target.value)}
                                    fullWidth
                                />
                                <TextField
                                    label="Max Duration"
                                    type="number"
                                    size="small"
                                    value={filters.maxDuration || ''}
                                    onChange={(e) => handleFilterChange('maxDuration', e.target.value)}
                                    fullWidth
                                />
                            </Box>

                            {/* Clear All Button */}
                            {activeFiltersCount > 0 && (
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                                    <IconButton
                                        size="small"
                                        onClick={() => {
                                            onFilterChange({});
                                            handleCloseFilters();
                                        }}
                                        sx={{ color: 'error.main' }}
                                    >
                                        <ClearIcon fontSize="small" />
                                        Clear All
                                    </IconButton>
                                </Box>
                            )}
                        </Box>
                    </Paper>
                </ClickAwayListener>
            </Popper>
        </Box>
    );
};

export default SearchBar;