import React, {useRef, useState} from 'react';
import {Provider} from '@clayui/core';
import ClayDatePicker, {FirstDayOfWeek} from '@clayui/date-picker';

/**
 * DatePicker Component
 * A comprehensive date picker component built on top of Clay UI DatePicker
 * 
 * @param {Object} props - Component props
 * @param {string} props.value - Current date value
 * @param {Function} props.onChange - Callback when date changes
 * @param {string} props.placeholder - Placeholder text for input
 * @param {boolean} props.disabled - Whether the date picker is disabled
 * @param {boolean} props.time - Whether to include time selection
 * @param {string} props.timezone - Timezone string (e.g., "GMT+01:00")
 * @param {boolean} props.use12Hours - Whether to use 12-hour format
 * @param {boolean} props.useNative - Whether to use native HTML date input
 * @param {boolean} props.range - Whether to enable date range selection
 * @param {string} props.dateFormat - Date format string
 * @param {FirstDayOfWeek} props.firstDayOfWeek - First day of week
 * @param {Array} props.months - Custom month names
 * @param {Array} props.weekdaysShort - Custom weekday abbreviations
 * @param {Object} props.years - Year range configuration
 * @param {boolean} props.expanded - Whether the picker is expanded
 * @param {Function} props.onExpandedChange - Callback when expanded state changes
 * @param {Function} props.onNavigation - Callback when navigating months/years
 * @param {boolean} props.yearsCheck - Whether to validate year range
 * @param {Object} props.ariaLabels - Accessibility labels
 * @param {boolean} props.showIcon - Whether to show the calendar icon button
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.style - Additional inline styles
 * @param {string} props.spritemap - Path to the spritemap for icons
 * @param {boolean} props.autoClose - Whether to automatically close the picker after date selection
 * 
 */
const DatePicker = ({
	value = '',
	onChange,
	placeholder = 'YYYY-MM-DD',
	disabled = false,
	time = false,
	timezone,
	use12Hours = false,
	useNative = false,
	range = false,
	dateFormat,
	firstDayOfWeek = FirstDayOfWeek.Sunday,
	months,
	weekdaysShort,
	years = {
		end: new Date().getFullYear(),
		start: 1998,
	},
	expanded,
	onExpandedChange,
	onNavigation,
	yearsCheck = true,
	ariaLabels = {},
	showIcon = true,
	className = '',
	style = {},
	spritemap = `${Liferay.ThemeDisplay.getPathThemeImages()}/clay/icons.svg`,
	autoClose = true,
	...otherProps
}) => {
	// Ensure spritemap is properly formatted
	const finalSpritemap = spritemap || '/o/classic-theme/images/lexicon/icons.svg';
	
	// Debug: Log the spritemap being used
	console.log('DatePicker spritemap:', finalSpritemap);
	
	// State for controlling picker expansion
	const [isExpanded, setIsExpanded] = useState(expanded);

	// Handle date change with auto-close functionality
	const handleDateChange = (newValue) => {
		if (onChange) {
			onChange(newValue);
		}
		
		// Auto-close the picker if enabled and not in range mode
		if (autoClose && !range) {
			setIsExpanded(false);
			if (onExpandedChange) {
				onExpandedChange(false);
			}
		}
	};

	// Handle expanded state changes
	const handleExpandedChange = (expandedState) => {
		setIsExpanded(expandedState);
		if (onExpandedChange) {
			onExpandedChange(expandedState);
		}
	};

	// Default aria labels
	const defaultAriaLabels = {
		buttonChooseDate: `Choose Date, selected date is ${
			value ? new Date(value).toLocaleString() : 'none'
		}`,
		buttonDot: 'Go to today',
		buttonNextMonth: 'Next month',
		buttonPreviousMonth: 'Previous month',
		chooseDate: 'Use the calendar to choose a Date. Current selection {0}',
		dialog: 'Choose Date',
		input: value ? new Date(value).toLocaleString() : '',
		openCalendar: 'Open Calendar Picker',
		selectMonth: 'Select a month',
		selectYear: 'Select a year',
	};

	const finalAriaLabels = { ...defaultAriaLabels, ...ariaLabels };

	return (
		<Provider spritemap={finalSpritemap}>
			<div className={`date-picker-wrapper ${className}`} style={style}>
				<ClayDatePicker
					{...otherProps}
					ariaLabels={finalAriaLabels}
					dateFormat={dateFormat}
					disabled={disabled}
					expanded={isExpanded}
					firstDayOfWeek={firstDayOfWeek}
					months={months}
					onChange={handleDateChange}
					onExpandedChange={handleExpandedChange}
					onNavigation={onNavigation}
					placeholder={placeholder}
					range={range}
					showIcon={showIcon}
					time={time}
					timezone={timezone}
					use12Hours={use12Hours}
					useNative={useNative}
					value={value}
					weekdaysShort={weekdaysShort}
					years={years}
					yearsCheck={yearsCheck}
					spritemap={finalSpritemap}
				/>
			</div>
		</Provider>
	);
};

export default DatePicker;

