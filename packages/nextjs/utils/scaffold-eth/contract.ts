import { Abi, ExtractAbiEvent, ExtractAbiFunction } from "abitype";
import { Address } from "viem";

export type GenericContract = {
  address: Address;
  abi: Abi;
  inheritedFunctions?: Record<string, string>;
  deploymentFile?: string;
  deploymentScript?: string;
};

export type GenericContractsDeclaration = Record<
  number,
  Record<string, GenericContract>
>;

export type ContractName<
  TContracts extends GenericContractsDeclaration = GenericContractsDeclaration,
  TChainId extends keyof TContracts = keyof TContracts,
> = keyof TContracts[TChainId];

export type Contract<
  TContracts extends GenericContractsDeclaration = GenericContractsDeclaration,
  TChainId extends keyof TContracts = keyof TContracts,
  TContractName extends ContractName<TContracts, TChainId> = ContractName<TContracts, TChainId>,
> = TContracts[TChainId][TContractName];

export type ContractAbi<
  TContracts extends GenericContractsDeclaration = GenericContractsDeclaration,
  TChainId extends keyof TContracts = keyof TContracts,
  TContractName extends ContractName<TContracts, TChainId> = ContractName<TContracts, TChainId>,
> = TContracts[TChainId][TContractName] extends { abi: infer TAbi } ? TAbi : never;

export type AbiFunctionInputs<TAbi extends Abi, TFunctionName extends string> = ExtractAbiFunction<
  TAbi,
  TFunctionName
>["inputs"];

export type AbiFunctionOutputs<TAbi extends Abi, TFunctionName extends string> = ExtractAbiFunction<
  TAbi,
  TFunctionName
>["outputs"];

export type AbiEventInputs<TAbi extends Abi, TEventName extends string> = ExtractAbiEvent<
  TAbi,
  TEventName
>["inputs"];

export type InheritedFunctions = Record<string, string>; 