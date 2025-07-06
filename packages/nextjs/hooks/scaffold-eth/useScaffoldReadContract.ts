import { useReadContract } from "wagmi";
import deployedContracts from "../../contracts/deployedContracts";

export const useScaffoldReadContract = ({
  contractName,
  functionName,
  args,
  ...readContractConfig
}: {
  contractName: keyof typeof deployedContracts[10143];
  functionName: string;
  args?: readonly unknown[];
} & Omit<Parameters<typeof useReadContract>[0], "abi" | "address" | "functionName" | "args">) => {
  const chainId = 10143;
  const contract = deployedContracts[chainId][contractName];

  return useReadContract({
    abi: contract.abi,
    address: contract.address,
    functionName: functionName as string,
    args: args as readonly unknown[],
    ...readContractConfig,
  });
}; 