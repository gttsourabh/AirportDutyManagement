import moment from 'moment';

export const getDayFromDate = date => moment(date).format('dddd');

export const formatDate = (date, fmt = 'DD MMM YYYY') => moment(date).format(fmt);

export const formatTime = (time, fmt = 'HH:mm') => moment(time, 'HH:mm').format(fmt);

export const formatDateTime = date => moment(date).format('DD MMM YYYY, HH:mm');

export const isToday = date => moment(date).isSame(moment(), 'day');

export const getTodayISO = () => moment().format('YYYY-MM-DD');

export const toAPIDate = date => moment(date).format('YYYY-MM-DD');

export const toAPITime = time => moment(time).format('HH:mm');
