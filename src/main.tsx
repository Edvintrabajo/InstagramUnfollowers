import React, { ChangeEvent, useEffect, useState } from 'react';
import { render } from 'preact';

// @ts-ignore
import styles from './styles.scss';

import { UserNode } from './model/user';
import { Toast } from './components/Toast';
import { UserCheckIcon } from './components/icons/UserCheckIcon';
import { UserUncheckIcon } from './components/icons/UserUncheckIcon';
import {
  DEFAULT_TIME_BETWEEN_SEARCH_CYCLES,
  DEFAULT_TIME_BETWEEN_UNFOLLOWS,
  DEFAULT_TIME_TO_WAIT_AFTER_FIVE_SEARCH_CYCLES,
  DEFAULT_TIME_TO_WAIT_AFTER_FIVE_UNFOLLOWS,
  INSTAGRAM_HOSTNAME,
  WHITELISTED_RESULTS_STORAGE_KEY,
} from './constants/constants';
import {
  assertUnreachable,
  getCookie,
  getCurrentPageUnfollowers,
  getUsersForDisplay,
  sleep,
  unfollowUserUrlGenerator,
} from './utils/utils';
import { NotSearching } from './components/NotSearching';
import { State } from './model/state';
import { Searching } from './components/Searching';
import { Toolbar } from './components/Toolbar';
import { Unfollowing } from './components/Unfollowing';
import { Timings } from './model/timings';

// 1. IMPORTAMOS TU NUEVO HOOK
import { useScanner } from './hooks/useScanner';

function App() {
  const [state, setState] = useState<State>({
    status: 'initial',
  });

  const [toast, setToast] = useState<
    { readonly show: false } | { readonly show: true; readonly text: string }
  >({
    show: false,
  });

  const [timings, setTimings] = useState<Timings>({
    timeBetweenSearchCycles: DEFAULT_TIME_BETWEEN_SEARCH_CYCLES,
    timeToWaitAfterFiveSearchCycles: DEFAULT_TIME_TO_WAIT_AFTER_FIVE_SEARCH_CYCLES,
    timeBetweenUnfollows: DEFAULT_TIME_BETWEEN_UNFOLLOWS,
    timeToWaitAfterFiveUnfollows: DEFAULT_TIME_TO_WAIT_AFTER_FIVE_UNFOLLOWS,
  });

  // 2. INICIALIZAMOS EL HOOK
  const { scannerState, startScan, togglePause, isPaused } = useScanner(timings);

  let isActiveProcess: boolean;
  switch (state.status) {
    case 'initial':
      isActiveProcess = false;
      break;
    case 'scanning':
      // Ahora dependemos del hook para saber si estamos procesando
      isActiveProcess = scannerState.isScanning;
      break;
    case 'unfollowing':
      isActiveProcess = state.percentage < 100;
      break;
    default:
      assertUnreachable(state);
  }

  // 3. SINCRONIZACIÓN: Cuando el hook actualiza datos, actualizamos la UI
  useEffect(() => {
    if (state.status === 'scanning') {
      setState(prev => ({
        ...prev,
        results: scannerState.results,
        percentage: scannerState.progress,
      }));

      // Si el hook termina de escanear, mostramos el mensaje final
      if (!scannerState.isScanning && scannerState.progress === 100) {
        setToast({ show: true, text: 'Scanning completed!' });
      }
    }
  }, [scannerState, state.status]);

  const onScan = async () => {
    if (state.status !== 'initial') {
      return;
    }
    const whitelistedResultsFromStorage: string | null = localStorage.getItem(
      WHITELISTED_RESULTS_STORAGE_KEY,
    );
    const whitelistedResults: readonly UserNode[] =
      whitelistedResultsFromStorage === null ? [] : JSON.parse(whitelistedResultsFromStorage);

    // Configuramos el estado inicial de la UI
    setState({
      status: 'scanning',
      page: 1,
      searchTerm: '',
      currentTab: 'non_whitelisted',
      percentage: 0,
      results: [],
      selectedResults: [],
      whitelistedResults,
      filter: {
        showNonFollowers: true,
        showFollowers: false,
        showVerified: true,
        showPrivate: true,
        showWithOutProfilePicture: true,
      },
    });

    // 4. DISPARAMOS EL ESCÁNER DEL HOOK
    startScan();
  };

  const handleScanFilter = (e: ChangeEvent<HTMLInputElement>) => {
    if (state.status !== 'scanning') {
      return;
    }

    if (state.selectedResults.length > 0) {
      if (!confirm('Changing filter options will clear selected users')) {
        setState({ ...state });
        return;
      }
    }
    setState({
      ...state,
      selectedResults: [],
      filter: {
        ...state.filter,
        [e.currentTarget.name]: e.currentTarget.checked,
      },
    });
  };

  const handleUnfollowFilter = (e: ChangeEvent<HTMLInputElement>) => {
    if (state.status !== 'unfollowing') {
      return;
    }
    setState({
      ...state,
      filter: {
        ...state.filter,
        [e.currentTarget.name]: e.currentTarget.checked,
      },
    });
  };

  const toggleUser = (newStatus: boolean, user: UserNode) => {
    if (state.status !== 'scanning') {
      return;
    }
    if (newStatus) {
      setState({ ...state, selectedResults: [...state.selectedResults, user] });
    } else {
      setState({
        ...state,
        selectedResults: state.selectedResults.filter(result => result.id !== user.id),
      });
    }
  };

  const toggleAllUsers = (e: ChangeEvent<HTMLInputElement>) => {
    if (state.status !== 'scanning') {
      return;
    }
    if (e.currentTarget.checked) {
      setState({
        ...state,
        selectedResults: getUsersForDisplay(
          state.results,
          state.whitelistedResults,
          state.currentTab,
          state.searchTerm,
          state.filter,
        ),
      });
    } else {
      setState({ ...state, selectedResults: [] });
    }
  };

  const toggleCurrentePageUsers = (e: ChangeEvent<HTMLInputElement>) => {
    if (state.status !== 'scanning') {
      return;
    }
    if (e.currentTarget.checked) {
      setState({
        ...state,
        selectedResults: getCurrentPageUnfollowers(
          getUsersForDisplay(
            state.results,
            state.whitelistedResults,
            state.currentTab,
            state.searchTerm,
            state.filter,
          ),
          state.page,
        ),
      });
    } else {
      setState({ ...state, selectedResults: [] });
    }
  };

  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isActiveProcess) {
        return;
      }

      // Estándar moderno para activar la alerta del navegador
      e.preventDefault();

      // Chrome requiere establecer returnValue (aunque esté obsoleto en la definición de TS)
      // Usamos este pequeño truco para que TypeScript no marque error rojo.
      (e as any).returnValue = '';
    };

    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [isActiveProcess]);

  // ELIMINADO: useEffect gigante de "scan". Ahora lo maneja el hook useScanner.

  // TODO: Mover esto a useUnfollowerQueue.ts en el futuro
  useEffect(() => {
    const unfollow = async () => {
      if (state.status !== 'unfollowing') {
        return;
      }

      const csrftoken = getCookie('csrftoken');
      if (csrftoken === null) {
        throw new Error('csrftoken cookie is null');
      }

      let counter = 0;
      for (const user of state.selectedResults) {
        counter += 1;
        const percentage = Math.floor((counter / state.selectedResults.length) * 100);
        try {
          await fetch(unfollowUserUrlGenerator(user.id), {
            headers: {
              'content-type': 'application/x-www-form-urlencoded',
              'x-csrftoken': csrftoken,
            },
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
          });
          setState(prevState => {
            if (prevState.status !== 'unfollowing') {
              return prevState;
            }
            return {
              ...prevState,
              percentage,
              unfollowLog: [...prevState.unfollowLog, { user, unfollowedSuccessfully: true }],
            };
          });
        } catch (e) {
          console.error(e);
          setState(prevState => {
            if (prevState.status !== 'unfollowing') {
              return prevState;
            }
            return {
              ...prevState,
              percentage,
              unfollowLog: [...prevState.unfollowLog, { user, unfollowedSuccessfully: false }],
            };
          });
        }

        if (user === state.selectedResults[state.selectedResults.length - 1]) {
          break;
        }

        await sleep(
          Math.floor(
            Math.random() * (timings.timeBetweenUnfollows * 1.2 - timings.timeBetweenUnfollows),
          ) + timings.timeBetweenUnfollows,
        );

        if (counter % 5 === 0) {
          setToast({
            show: true,
            text: `Sleeping ${
              timings.timeToWaitAfterFiveUnfollows / 60000
            } minutes to prevent getting temp blocked`,
          });
          await sleep(timings.timeToWaitAfterFiveUnfollows);
        }
        setToast({ show: false });
      }
    };
    unfollow();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.status]);

  let markup: React.JSX.Element;
  switch (state.status) {
    case 'initial':
      markup = <NotSearching onScan={onScan} />;
      break;

    case 'scanning': {
      markup = (
        <Searching
          state={state}
          handleScanFilter={handleScanFilter}
          toggleUser={toggleUser}
          pauseScan={togglePause} // Usamos la función del hook
          setState={setState}
          scanningPaused={isPaused} // Usamos el estado del hook
          UserCheckIcon={UserCheckIcon}
          UserUncheckIcon={UserUncheckIcon}
        />
      );
      break;
    }

    case 'unfollowing':
      markup = <Unfollowing state={state} handleUnfollowFilter={handleUnfollowFilter} />;
      break;

    default:
      assertUnreachable(state);
  }

  return (
    <main id='main' role='main' className='iu'>
      {/* --- AÑADE ESTA LÍNEA AQUÍ --- */}
      <style>{styles.toString()}</style>
      {/* ----------------------------- */}

      <section className='overlay'>
        <Toolbar
          state={state}
          setState={setState}
          scanningPaused={isPaused}
          isActiveProcess={isActiveProcess}
          toggleAllUsers={toggleAllUsers}
          toggleCurrentePageUsers={toggleCurrentePageUsers}
          setTimings={setTimings}
          currentTimings={timings}
          // --- AÑADIR ESTA LÍNEA ---
          onShowToast={text => setToast({ show: true, text })}
        />

        {markup}

        {/* Mensaje de estado del hook */}
        {state.status === 'scanning' && (
          <div
            style={{
              position: 'absolute',
              bottom: 10,
              left: 10,
              background: 'rgba(0,0,0,0.7)',
              color: 'white',
              padding: 5,
              borderRadius: 5,
            }}
          >
            {scannerState.statusMessage}
          </div>
        )}

        {toast.show && (
          <Toast show={toast.show} message={toast.text} onClose={() => setToast({ show: false })} />
        )}
      </section>
    </main>
  );
}

// Entry Point
const APP_ID = 'ig-unfollower-pro-overlay';

if (location.hostname !== INSTAGRAM_HOSTNAME) {
  alert('This tool only works inside Instagram.');
} else {
  if (!document.getElementById(APP_ID)) {
    const appHost = document.createElement('div');
    appHost.id = APP_ID;
    appHost.style.position = 'fixed';
    appHost.style.top = '0';
    appHost.style.left = '0';
    appHost.style.width = '100vw';
    appHost.style.height = '100vh';
    appHost.style.zIndex = '99999';
    appHost.style.pointerEvents = 'none';

    document.body.appendChild(appHost);
    const shadowRoot = appHost.attachShadow({ mode: 'open' });

    // Inyectaremos los estilos aquí más adelante
    render(<App />, shadowRoot as unknown as Element);
  }
}
