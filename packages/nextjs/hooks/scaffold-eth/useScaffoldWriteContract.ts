import { useWriteContract } from "wagmi";
import deployedContracts from "../../contracts/deployedContracts";

export const useScaffoldWriteContract = ({
  contractName,
}: {
  contractName: keyof typeof deployedContracts[10143];
}) => {
  const chainId = 10143;
  const contract = deployedContracts[chainId][contractName];

  const { writeContract, writeContractAsync, ...writeContractResult } = useWriteContract();

  const writeContractAsyncWithDefaults = async ({
    functionName,
    args,
    value,
    ...writeContractConfig
  }: {
    functionName: string;
    args?: readonly unknown[];
    value?: bigint;
  } & Omit<Parameters<typeof writeContractAsync>[0], "abi" | "address" | "functionName" | "args" | "value" | "type">) => {
    return writeContractAsync({
      abi: contract.abi,
      address: contract.address,
      functionName,
      args,
      value,
      ...writeContractConfig,
    } as Parameters<typeof writeContractAsync>[0]);
  };

  return {
    writeContract,
    writeContractAsync: writeContractAsyncWithDefaults,
    ...writeContractResult,
  };
}; 