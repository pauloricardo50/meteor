import React, { useState } from 'react';

import IconButton from 'core/components/IconButton';
import Dialog from 'core/components/Material/Dialog';
import AdminSearchResults from './AdminSearchResults/AdminSearchResults';
import AdminSearchForm from './AdminSearchForm';

const AdminSearch = ({ setOpenSearch, openSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
      <IconButton type="search" onClick={() => setOpenSearch(true)} />
      <Dialog
        open={openSearch}
        onClose={() => setOpenSearch(false)}
        className="admin-search"
      >
        <AdminSearchForm onSubmit={setSearchQuery} />
        {searchQuery && (
          <AdminSearchResults
            searchQuery={searchQuery}
            closeSearch={() => setOpenSearch(false)}
          />
        )}
      </Dialog>
    </>
  );
};

export default AdminSearch;
