"""Smart notifications and calendar integration"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timedelta
import re

router = APIRouter()

class Notification(BaseModel):
    type: str  # 'renewal', 'cancellation', 'payment', 'deadline'
    date: str
    message: str
    action_url: Optional[str] = None

class NotificationsResponse(BaseModel):
    notifications: List[Notification]
    icalendar: str  # For Google Calendar import

def extract_dates(text: str) -> List[dict]:
    """Extract important dates from document"""
    dates = []
    
    # Look for renewal dates
    renewal_match = re.search(
        r'(renew|renewal|auto[- ]?renew).*?(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})',
        text,
        re.IGNORECASE
    )
    if renewal_match:
        dates.append({
            'type': 'renewal',
            'date': renewal_match.group(2),
            'message': 'Auto-renewal date'
        })
    
    # Look for cancellation deadlines
    cancel_match = re.search(
        r'(cancel|cancellation).*?(?:(\d+)\s*(?:day|days|month|months)).*?(?:before|prior)',
        text,
        re.IGNORECASE
    )
    if cancel_match:
        days = int(cancel_match.group(2))
        dates.append({
            'type': 'cancellation',
            'date': (datetime.now() + timedelta(days=days)).strftime('%Y-%m-%d'),
            'message': f'Cancellation deadline (in {days} days)'
        })
    
    return dates

@router.post("/notifications", response_model=NotificationsResponse)
async def get_notifications(text: str):
    """
    Extract important dates and create notifications
    
    Unique feature: Automatic calendar reminders
    """
    dates = extract_dates(text)
    
    notifications = []
    for date_info in dates:
        notifications.append(Notification(
            type=date_info['type'],
            date=date_info['date'],
            message=date_info['message'],
            action_url=None
        ))
    
    # Generate iCalendar format
    icalendar = "BEGIN:VCALENDAR\nVERSION:2.0\n"
    for notif in notifications:
        icalendar += f"""BEGIN:VEVENT
DTSTART:{notif.date.replace('-', '')}
SUMMARY:{notif.message}
DESCRIPTION:Reminder from PaiperSum
END:VEVENT
"""
    icalendar += "END:VCALENDAR"
    
    return NotificationsResponse(
        notifications=notifications,
        icalendar=icalendar
    )
