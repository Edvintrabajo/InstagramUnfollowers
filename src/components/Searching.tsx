import React from 'react';
import {
  assertUnreachable,
  getCurrentPageUnfollowers,
  getMaxPage,
  getUsersForDisplay,
} from '../utils/utils';
import { State } from '../model/state';
import { UserNode } from '../model/user';
import { WHITELISTED_RESULTS_STORAGE_KEY } from '../constants/constants';

export interface SearchingProps {
  state: State;
  setState: (state: State) => void;
  scanningPaused: boolean;
  pauseScan: () => void;
  handleScanFilter: (e: React.ChangeEvent<HTMLInputElement>) => void;
  toggleUser: (checked: boolean, user: UserNode) => void;
  UserCheckIcon: React.FC;
  UserUncheckIcon: React.FC;
}

// --- Sub-component: Filters Sidebar ---
const FiltersSidebar = ({
  state,
  handleScanFilter,
}: {
  state: State;
  handleScanFilter: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <menu className='flex column m-clear p-clear'>
    <p style={{ fontWeight: 'bold' }}>Filters</p>
    {[
      { name: 'showNonFollowers', label: 'Non-Followers' },
      { name: 'showFollowers', label: 'Followers' },
      { name: 'showVerified', label: 'Verified' },
      { name: 'showPrivate', label: 'Private' },
      { name: 'showWithOutProfilePicture', label: 'No Profile Pic' },
    ].map(filter => (
      <label key={filter.name} className='badge m-small' style={{ cursor: 'pointer' }}>
        <input
          type='checkbox'
          name={filter.name}
          // @ts-ignore (Accessing dynamic property is safe here)
          checked={state.filter[filter.name]}
          onChange={handleScanFilter}
        />
        &nbsp;{filter.label}
      </label>
    ))}
  </menu>
);

export const Searching = ({
  state,
  setState,
  scanningPaused,
  pauseScan,
  handleScanFilter,
  toggleUser,
  UserCheckIcon,
  UserUncheckIcon,
}: SearchingProps) => {
  if (state.status !== 'scanning') {
    return null;
  }

  const usersForDisplay = getUsersForDisplay(
    state.results,
    state.whitelistedResults,
    state.currentTab,
    state.searchTerm,
    state.filter,
  );

  let currentLetter = '';

  const renderLetterHeader = (firstLetter: string) => {
    currentLetter = firstLetter;
    return <div className='alphabet-character'>{currentLetter}</div>;
  };

  // --- Handlers ---

  const handlePageChange = (direction: 'prev' | 'next') => {
    const maxPage = getMaxPage(usersForDisplay);
    let newPage = state.page;

    if (direction === 'prev' && state.page > 1) {
      newPage--;
    }
    if (direction === 'next' && state.page < maxPage) {
      newPage++;
    }

    if (newPage !== state.page) {
      setState({ ...state, page: newPage });
    }
  };

  // Añadimos <HTMLDivElement> al tipo del evento
  const handleWhitelistToggle = (e: React.MouseEvent<HTMLDivElement>, user: UserNode) => {
    e.preventDefault();
    e.stopPropagation();

    let newWhitelisted: readonly UserNode[] = [];

    switch (state.currentTab) {
      case 'non_whitelisted':
        newWhitelisted = [...state.whitelistedResults, user];
        break;
      case 'whitelisted':
        newWhitelisted = state.whitelistedResults.filter(u => u.id !== user.id);
        break;
      default:
        assertUnreachable(state.currentTab);
    }

    localStorage.setItem(WHITELISTED_RESULTS_STORAGE_KEY, JSON.stringify(newWhitelisted));
    setState({ ...state, whitelistedResults: newWhitelisted });
  };

  const handleUnfollowStart = () => {
    if (!confirm(`Are you sure you want to unfollow ${state.selectedResults.length} users?`)) {
      return;
    }

    if (state.selectedResults.length === 0) {
      alert('Select at least one user to unfollow.');
      return;
    }

    setState({
      ...state,
      status: 'unfollowing',
      percentage: 0,
      unfollowLog: [],
      filter: { showSucceeded: true, showFailed: true },
    });
  };

  return (
    <section className='flex'>
      <aside className='app-sidebar'>
        <FiltersSidebar state={state} handleScanFilter={handleScanFilter} />

        <div className='grow stats-box'>
          <p>Displayed: {usersForDisplay.length}</p>
          <p>Total: {state.results.length}</p>
        </div>

        <div className='controls'>
          <button
            className={`button-control ${scanningPaused ? 'btn-resume' : 'btn-pause'}`}
            onClick={pauseScan}
          >
            {scanningPaused ? 'Resume Scan' : 'Pause Scan'}
          </button>
        </div>

        <div className='grow t-center pagination-controls'>
          <p>Pages</p>
          <div className='flex justify-center align-center'>
            <button className='btn-icon' onClick={() => handlePageChange('prev')}>
              ❮
            </button>
            <span className='page-indicator'>
              {state.page} / {getMaxPage(usersForDisplay)}
            </span>
            <button className='btn-icon' onClick={() => handlePageChange('next')}>
              ❯
            </button>
          </div>
        </div>

        <button
          className='unfollow btn-danger'
          onClick={handleUnfollowStart}
          disabled={state.selectedResults.length === 0}
        >
          UNFOLLOW ({state.selectedResults.length})
        </button>
      </aside>

      <article className='results-container'>
        <nav className='tabs-container'>
          <div
            className={`tab ${state.currentTab === 'non_whitelisted' ? 'tab-active' : ''}`}
            onClick={() =>
              setState({ ...state, currentTab: 'non_whitelisted', selectedResults: [] })
            }
          >
            Non-Whitelisted
          </div>
          <div
            className={`tab ${state.currentTab === 'whitelisted' ? 'tab-active' : ''}`}
            onClick={() => setState({ ...state, currentTab: 'whitelisted', selectedResults: [] })}
          >
            Whitelisted
          </div>
        </nav>

        {getCurrentPageUnfollowers(usersForDisplay, state.page).map(user => {
          const firstLetter = user.username.substring(0, 1).toUpperCase();
          const isNewLetter = firstLetter !== currentLetter;

          return (
            <React.Fragment key={user.id}>
              {isNewLetter && renderLetterHeader(firstLetter)}

              <label className='result-item'>
                <div className='flex grow align-center'>
                  <div className='avatar-container' onClick={e => handleWhitelistToggle(e, user)}>
                    <img
                      className='avatar'
                      alt={user.username}
                      src={user.profile_pic_url}
                      loading='lazy'
                    />
                    <span className='avatar-icon-overlay-container'>
                      {state.currentTab === 'non_whitelisted' ? (
                        <UserCheckIcon />
                      ) : (
                        <UserUncheckIcon />
                      )}
                    </span>
                  </div>

                  <div className='flex column m-medium user-info'>
                    <a
                      className='fs-xlarge user-link'
                      target='_blank'
                      href={`https://www.instagram.com/${user.username}`}
                      rel='noreferrer'
                      title={user.username}
                    >
                      {user.username}
                    </a>
                    <span className='fs-medium text-muted' title={user.full_name}>
                      {user.full_name}
                    </span>
                  </div>

                  {user.is_verified && (
                    <div className='verified-badge' title='Verified'>
                      ✔
                    </div>
                  )}
                  {user.is_private && <div className='private-indicator'>Private</div>}
                </div>

                <input
                  className='account-checkbox'
                  type='checkbox'
                  checked={state.selectedResults.some(r => r.id === user.id)}
                  onChange={e => toggleUser(e.currentTarget.checked, user)}
                />
              </label>
            </React.Fragment>
          );
        })}
      </article>
    </section>
  );
};
