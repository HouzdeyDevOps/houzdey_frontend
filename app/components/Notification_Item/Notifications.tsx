interface Notification {
    id: number;
    title: string;
    description: string;
    time?: string; // Optional since one entry uses 'date' instead of 'time'
    date?: string; // Optional to accommodate different formats
    image: string;
}

export const Notificationsdata: Notification[] = [
    {
        id: 1,
        title: "New List Alert",
        description: "A 2-bedroom apartment at Lekki is now available. Check it out before it’s gone",
        time: "3:00",
        image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1380&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        id: 2,
        title: "Listing Expiry Reminder",
        description: "Your property listing is near its maximum duration of one month. To keep it live, please renew or update the listing before it expires.",
        time: "3:00pm",
        image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1380&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        id: 3,
        title: "Property listing posted!",
        description: "We are excited to inform you that your property listing has been successfully posted following the recent network restoration.",
        time: "3:00pm",
        image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1380&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        id: 4,
        title: "Property listing Available!",
        description: "2-bedroom apartment at Lekki” is now available.",
        time: "28/12/24",
        image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1380&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    }
];
