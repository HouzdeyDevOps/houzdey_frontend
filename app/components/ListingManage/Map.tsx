export default function Map() {
    return (
        <div className=" mb-10">
            <h1 className="pb-5">Choose from the map</h1>
            <div style={{ width: "100%", borderRadius: "24px", overflow: "hidden" }}>
                <iframe 
                    width="100%" 
                    height="359" 
                    frameBorder="0" 
                    scrolling="no" 
                    marginHeight={0} 
                    marginWidth={0} 
                    src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=surulere+(My%20Business%20Name)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
                >
                </iframe>
            </div>
        </div>
    );
}
