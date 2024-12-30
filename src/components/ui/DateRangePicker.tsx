import { useState } from 'react';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from './Button';
import ReactDatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

interface DateRangePickerProps {
  value: [Date, Date];
  onChange: (dates: [Date, Date]) => void;
}

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  return (
    <div className="relative">
      <ReactDatePicker
        selectsRange={true}
        startDate={value[0]}
        endDate={value[1]}
        onChange={(dates: [Date, Date]) => {
          if (dates[0] && dates[1]) {
            onChange(dates);
          }
        }}
        customInput={
          <Button variant="outline" className="w-auto">
            <Calendar className="w-4 h-4 mr-2" />
            {format(value[0], 'MMM d, yyyy')} - {format(value[1], 'MMM d, yyyy')}
          </Button>
        }
      />
    </div>
  );
} 