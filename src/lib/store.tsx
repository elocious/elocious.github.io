import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { EvaluatedProperty, BuyerPersona, ViewMode } from '../types';
import { evaluateProperty } from './evaluation';
import { seedProperties } from '../data/seedData';

interface AppState {
  properties: EvaluatedProperty[];
  comparisonIds: string[];
  persona: BuyerPersona;
  view: ViewMode;
}

type Action =
  | { type: 'ADD_PROPERTY'; property: EvaluatedProperty }
  | { type: 'DELETE_PROPERTY'; id: string }
  | { type: 'UPDATE_PROPERTY'; property: EvaluatedProperty }
  | { type: 'TOGGLE_COMPARISON'; id: string }
  | { type: 'CLEAR_COMPARISON' }
  | { type: 'UPDATE_PERSONA'; persona: BuyerPersona }
  | { type: 'SET_VIEW'; view: ViewMode }
  | { type: 'LOAD_STATE'; state: Partial<AppState> };

const STORAGE_KEY = 'betterhome-state-v1';

const defaultPersona: BuyerPersona = {
  investmentHorizon: 'forever',
  riskTolerance: 'balanced',
  priorities: { schools: 7, commute: 6, appreciation: 8, lotSize: 5 },
};

const initialState: AppState = {
  properties: seedProperties,
  comparisonIds: [],
  persona: defaultPersona,
  view: 'vault',
};

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'ADD_PROPERTY':
      return { ...state, properties: [action.property, ...state.properties] };
    case 'DELETE_PROPERTY':
      return {
        ...state,
        properties: state.properties.filter(p => p.id !== action.id),
        comparisonIds: state.comparisonIds.filter(id => id !== action.id),
      };
    case 'UPDATE_PROPERTY':
      return {
        ...state,
        properties: state.properties.map(p => (p.id === action.property.id ? action.property : p)),
      };
    case 'TOGGLE_COMPARISON': {
      if (state.comparisonIds.includes(action.id))
        return { ...state, comparisonIds: state.comparisonIds.filter(id => id !== action.id) };
      if (state.comparisonIds.length >= 4) return state;
      return { ...state, comparisonIds: [...state.comparisonIds, action.id] };
    }
    case 'CLEAR_COMPARISON':
      return { ...state, comparisonIds: [] };
    case 'UPDATE_PERSONA':
      return {
        ...state,
        persona: action.persona,
        properties: state.properties.map(p => ({ ...p, evaluation: evaluateProperty(p, action.persona) })),
      };
    case 'SET_VIEW':
      return { ...state, view: action.view };
    case 'LOAD_STATE':
      return { ...state, ...action.state };
    default:
      return state;
  }
}

function init(): AppState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...initialState,
        ...parsed,
        view: 'vault',
      };
    }
  } catch { /* ignore */ }
  return initialState;
}

interface StoreValue {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState, init);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          properties: state.properties,
          comparisonIds: state.comparisonIds,
          persona: state.persona,
        }),
      );
    } catch { /* ignore */ }
  }, [state.properties, state.comparisonIds, state.persona]);

  return <StoreContext.Provider value={{ state, dispatch }}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
