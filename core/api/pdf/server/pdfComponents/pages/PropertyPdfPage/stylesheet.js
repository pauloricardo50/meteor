export default `
    .pdf-google-map {
        margin-bottom: 40px;
        height: 300px;
        background-position: center center;
        background-size: cover;
        background-repeat: no-repeat;
    }

    .property-page table {
        // width: 100%;
    }

    .property-page .property-tables {
        width: 100%;
        display: flex;
        justify-content: space-between;
    }

    .property-page .property-tables > * {
        width: 49%;
        flex-grow: 1; // Let table take full width if there is only 1 table
    }

    .other-real-estate {
        // margin-left: 16px;
    }
`;
